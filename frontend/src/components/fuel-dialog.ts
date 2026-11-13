// Saisie rapide d'un plein : kilométrage, quantité, montant (le reste facultatif).
import { html, LitElement, nothing, type PropertyValues } from "lit";

import { fetchFuelDefaults, saveFuel } from "../api";
import { inputNumber, parseNumber, round } from "../format";
import { t, type Key } from "../i18n";
import { mdiClose, sharedStyles } from "../styles";
import type {
  CoherenceWarning,
  FuelEntryView,
  FuelType,
  HomeAssistant,
  VehicleView,
} from "../types";
import { dialogStyles } from "./dialog-styles";
import { icon } from "./icon";
import { formatWarning } from "./warnings";

type AmountField = "volume" | "unit_price" | "total_cost";
const AMOUNT_FIELDS: AmountField[] = ["volume", "unit_price", "total_cost"];
const DIGITS: Record<AmountField, number> = { volume: 2, unit_price: 3, total_cost: 2 };

export class VlFuelDialog extends LitElement {
  static override properties = {
    hass: { attribute: false },
    vehicle: { attribute: false },
    currency: { type: String },
    _values: { state: true },
    _edits: { state: true },
    _warnings: { state: true },
    _error: { state: true },
    _busy: { state: true },
    _entry: { state: true },
  };
  static override styles = [sharedStyles, dialogStyles];

  declare hass: HomeAssistant;
  declare vehicle: VehicleView;
  declare currency: string;
  declare _values: Record<string, string>;
  /** Ordre des montants saisis par l'utilisateur (le plus récent en dernier). */
  declare _edits: AmountField[];
  declare _warnings: CoherenceWarning[];
  declare _error: string;
  declare _busy: boolean;
  declare _entry: FuelEntryView | null;

  constructor() {
    super();
    this.currency = "EUR";
    this._values = {};
    this._edits = [];
    this._warnings = [];
    this._error = "";
    this._busy = false;
    this._entry = null;
  }

  private get _dialog(): HTMLDialogElement {
    return this.renderRoot.querySelector("dialog") as HTMLDialogElement;
  }

  /** Ouvrir pour un nouveau plein (valeurs pré-remplies) ou une modification. */
  async open(entry: FuelEntryView | null = null): Promise<void> {
    this._entry = entry;
    this._warnings = [];
    this._error = "";
    if (entry) {
      this._values = {
        odometer: inputNumber(this.hass, entry.odometer, 1),
        volume: inputNumber(this.hass, entry.volume, 2),
        unit_price: inputNumber(this.hass, entry.unit_price, 3),
        total_cost: inputNumber(this.hass, entry.total_cost, 2),
        date: entry.date,
        time: entry.time ?? "",
        fuel_type: entry.fuel_type,
        full_tank: entry.full_tank ? "1" : "",
        station: entry.station ?? "",
        notes: entry.notes,
      };
      this._edits = ["volume", "total_cost"];
    } else {
      this._values = { full_tank: "1", fuel_type: this.vehicle.fuel_types[0] };
      this._edits = [];
      try {
        const defaults = await fetchFuelDefaults(this.hass, this.vehicle.id);
        const price = defaults.unit_price[defaults.fuel_type];
        this._values = {
          ...this._values,
          odometer: defaults.odometer !== null ? String(round(defaults.odometer, 0)) : "",
          fuel_type: defaults.fuel_type,
          date: defaults.date,
          time: defaults.time,
          unit_price: price !== null ? inputNumber(this.hass, price, 3) : "",
        };
        // Le dernier prix connu sert de point de départ, au rang le plus faible.
        if (price !== null) this._edits = ["unit_price"];
      } catch (err) {
        this._error = (err as Error).message;
      }
    }
    await this.updateComplete;
    this._dialog.showModal();
    const odometer = this.renderRoot.querySelector<HTMLInputElement>("#odometer");
    odometer?.focus();
    odometer?.select();
  }

  close(): void {
    this._dialog?.close();
  }

  protected override willUpdate(changed: PropertyValues): void {
    if (changed.has("vehicle") && this.vehicle && !this._values.fuel_type) {
      this._values = { ...this._values, fuel_type: this.vehicle.fuel_types[0] };
    }
  }

  private _derivedField(): AmountField | null {
    const recent = this._edits.slice(-2);
    if (recent.length < 2) return null;
    return AMOUNT_FIELDS.find((f) => !recent.includes(f)) ?? null;
  }

  private _onAmountInput(field: AmountField, raw: string): void {
    const edits = this._edits.filter((f) => f !== field);
    edits.push(field);
    this._edits = edits;
    const values = { ...this._values, [field]: raw };
    const derived = this._derivedField();
    if (derived) {
      const v = parseNumber(values.volume ?? "");
      const p = parseNumber(values.unit_price ?? "");
      const m = parseNumber(values.total_cost ?? "");
      let result: number | null = null;
      if (derived === "total_cost" && v !== null && p !== null) result = v * p;
      if (derived === "unit_price" && v && m !== null) result = m / v;
      if (derived === "volume" && p && m !== null) result = m / p;
      values[derived] =
        result !== null ? inputNumber(this.hass, result, DIGITS[derived]) : "";
    }
    this._values = values;
    this._warnings = [];
  }

  private _set(name: string, value: string): void {
    this._values = { ...this._values, [name]: value };
    this._warnings = [];
  }

  private async _submit(confirm = false): Promise<void> {
    this._error = "";
    const recent = this._edits.slice(-2);
    const odometer = parseNumber(this._values.odometer ?? "");
    if (odometer === null) {
      this._error = t(this.hass, "fuel.odometer", { unit: this.vehicle.units.distance });
      return;
    }
    const payload: Record<string, unknown> = {
      odometer,
      full_tank: Boolean(this._values.full_tank),
      fuel_type: this._values.fuel_type,
      station: this._values.station || null,
      notes: this._values.notes ?? "",
      confirm,
    };
    // Seules les deux valeurs saisies sont envoyées : le serveur calcule la troisième.
    for (const field of recent) {
      const value = parseNumber(this._values[field] ?? "");
      if (value !== null) payload[field] = value;
    }
    if (AMOUNT_FIELDS.filter((f) => f in payload).length < 2) {
      this._error = t(this.hass, "fuel.need_two");
      return;
    }
    if (this._values.date) payload.date = this._values.date;
    if (this._values.time) payload.time = this._values.time;
    else if (this._values.date) payload.time = null;
    if (this._entry) payload.entry_id = this._entry.id;

    this._busy = true;
    try {
      const result = await saveFuel(this.hass, this.vehicle.id, payload);
      if (!result.saved) {
        this._warnings = result.warnings;
        return;
      }
      this.close();
      this.dispatchEvent(new CustomEvent("saved", { bubbles: true, composed: true }));
    } catch (err) {
      this._error = t(this.hass, "common.error", { message: (err as Error).message });
    } finally {
      this._busy = false;
    }
  }

  private _amountInput(field: AmountField, label: string) {
    const derived = this._derivedField() === field;
    return html`<div class="field">
      <label for=${field}>${label}</label>
      <input
        id=${field}
        name=${field}
        inputmode="decimal"
        autocomplete="off"
        aria-describedby=${derived ? `${field}-hint` : nothing}
        class=${derived ? "computed" : ""}
        .value=${this._values[field] ?? ""}
        @input=${(e: Event) => this._onAmountInput(field, (e.target as HTMLInputElement).value)}
      />
      ${derived
        ? html`<span class="hint" id="${field}-hint">${t(this.hass, "fuel.computed")}</span>`
        : nothing}
    </div>`;
  }

  protected override render() {
    if (!this.vehicle) return nothing;
    const hass = this.hass;
    const fuel = (this._values.fuel_type ?? this.vehicle.fuel_types[0]) as FuelType;
    const volumeUnit = this.vehicle.units.volume[fuel] ?? "L";
    const title = t(hass, this._entry ? "fuel.title_edit" : "fuel.title_new");
    return html`<dialog aria-labelledby="fuel-title" @close=${() => (this._warnings = [])}>
      <form
        method="dialog"
        @submit=${(e: Event) => {
          e.preventDefault();
          void this._submit();
        }}
      >
        <header>
          <h2 id="fuel-title">${title} · ${this.vehicle.name}</h2>
          <button
            type="button"
            class="icon"
            aria-label=${t(hass, "common.close")}
            @click=${() => this.close()}
          >
            ${icon(mdiClose)}
          </button>
        </header>
        <div class="body">
          <div class="grid">
            <div class="field">
              <label for="odometer">
                ${t(hass, "fuel.odometer", { unit: this.vehicle.units.distance })}
              </label>
              <input
                id="odometer"
                name="odometer"
                inputmode="decimal"
                autocomplete="off"
                required
                .value=${this._values.odometer ?? ""}
                @input=${(e: Event) => this._set("odometer", (e.target as HTMLInputElement).value)}
              />
            </div>
            ${this._amountInput("volume", t(hass, "fuel.volume", { unit: volumeUnit }))}
            ${this._amountInput(
              "total_cost",
              t(hass, "fuel.total", { currency: this.currency }),
            )}
            ${this._amountInput(
              "unit_price",
              t(hass, "fuel.unit_price", { currency: this.currency, unit: volumeUnit }),
            )}
          </div>
          <label class="check">
            <input
              type="checkbox"
              .checked=${Boolean(this._values.full_tank)}
              @change=${(e: Event) =>
                this._set("full_tank", (e.target as HTMLInputElement).checked ? "1" : "")}
            />
            ${t(hass, "fuel.full_tank")}
          </label>
          <details ?open=${Boolean(this._entry)}>
            <summary>${t(hass, "common.more")}</summary>
            <div class="grid">
              <div class="field">
                <label for="date">${t(hass, "fuel.date")}</label>
                <input
                  id="date"
                  type="date"
                  .value=${this._values.date ?? ""}
                  @change=${(e: Event) => this._set("date", (e.target as HTMLInputElement).value)}
                />
              </div>
              <div class="field">
                <label for="time">${t(hass, "fuel.time")}</label>
                <input
                  id="time"
                  type="time"
                  .value=${this._values.time ?? ""}
                  @change=${(e: Event) => this._set("time", (e.target as HTMLInputElement).value)}
                />
              </div>
              ${this.vehicle.fuel_types.length > 1
                ? html`<div class="field">
                    <label for="fuel_type">${t(hass, "fuel.fuel_type")}</label>
                    <select
                      id="fuel_type"
                      .value=${fuel}
                      @change=${(e: Event) =>
                        this._set("fuel_type", (e.target as HTMLSelectElement).value)}
                    >
                      ${this.vehicle.fuel_types.map(
                        (f) =>
                          html`<option value=${f} ?selected=${f === fuel}>
                            ${t(hass, `fuel_type.${f}` as Key)}
                          </option>`,
                      )}
                    </select>
                  </div>`
                : nothing}
              <div class="field">
                <label for="station">${t(hass, "fuel.station")}</label>
                <input
                  id="station"
                  autocomplete="off"
                  .value=${this._values.station ?? ""}
                  @input=${(e: Event) => this._set("station", (e.target as HTMLInputElement).value)}
                />
              </div>
            </div>
            <div class="field" style="margin-top: var(--vl-gap)">
              <label for="notes">${t(hass, "fuel.notes")}</label>
              <textarea
                id="notes"
                .value=${this._values.notes ?? ""}
                @input=${(e: Event) => this._set("notes", (e.target as HTMLTextAreaElement).value)}
              ></textarea>
            </div>
          </details>
          ${this._warnings.length
            ? html`<div class="warnings" role="alert">
                ${t(hass, "fuel.warnings")}
                <ul>
                  ${this._warnings.map(
                    (w) => html`<li>${formatWarning(hass, w, this.vehicle, fuel, this.currency)}</li>`,
                  )}
                </ul>
              </div>`
            : nothing}
          ${this._error ? html`<p class="error" role="alert">${this._error}</p>` : nothing}
        </div>
        <footer>
          <button type="button" @click=${() => this.close()}>${t(hass, "common.cancel")}</button>
          ${this._warnings.length
            ? html`<button
                type="button"
                class="primary"
                ?disabled=${this._busy}
                @click=${() => this._submit(true)}
              >
                ${t(hass, "fuel.save_anyway")}
              </button>`
            : html`<button type="submit" class="primary" ?disabled=${this._busy}>
                ${t(hass, "common.save")}
              </button>`}
        </footer>
      </form>
    </dialog>`;
  }
}
