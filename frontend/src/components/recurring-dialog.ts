// Saisie / modification d'une dépense récurrente (abonnement, assurance…).
import { html, LitElement, nothing } from "lit";

import { saveRecurring } from "../api";
import { inputNumber, parseNumber, todayIso } from "../format";
import { t, type Key } from "../i18n";
import { mdiClose, sharedStyles } from "../styles";
import type { Category, HomeAssistant, RecurringView, VehicleView } from "../types";
import { dialogStyles } from "./dialog-styles";
import { icon } from "./icon";

export const INTERVALS = [1, 2, 3, 6, 12] as const;

export class VlRecurringDialog extends LitElement {
  static override properties = {
    hass: { attribute: false },
    vehicle: { attribute: false },
    categories: { attribute: false },
    currency: { type: String },
    _values: { state: true },
    _error: { state: true },
    _busy: { state: true },
    _entry: { state: true },
  };
  static override styles = [sharedStyles, dialogStyles];

  declare hass: HomeAssistant;
  declare vehicle: VehicleView;
  declare categories: Category[];
  declare currency: string;
  declare _values: Record<string, string>;
  declare _error: string;
  declare _busy: boolean;
  declare _entry: RecurringView | null;

  constructor() {
    super();
    this.categories = [];
    this.currency = "EUR";
    this._values = {};
    this._error = "";
    this._busy = false;
    this._entry = null;
  }

  private get _dialog(): HTMLDialogElement {
    return this.renderRoot.querySelector("dialog") as HTMLDialogElement;
  }

  async open(entry: RecurringView | null = null): Promise<void> {
    this._entry = entry;
    this._error = "";
    this._values = entry
      ? {
          label: entry.label,
          amount: inputNumber(this.hass, entry.amount, 2),
          category_id: entry.category_id,
          interval_months: String(entry.interval_months),
          start_date: entry.start_date,
          end_date: entry.end_date ?? "",
          active: entry.active ? "1" : "",
        }
      : {
          category_id: "insurance",
          interval_months: "1",
          start_date: todayIso(),
          active: "1",
        };
    if (!this.categories.some((c) => c.id === this._values.category_id)) {
      this._values = { ...this._values, category_id: this.categories[0]?.id ?? "other" };
    }
    await this.updateComplete;
    this._dialog.showModal();
    this.renderRoot.querySelector<HTMLInputElement>("#label")?.focus();
  }

  close(): void {
    this._dialog?.close();
  }

  private _set(name: string, value: string): void {
    this._values = { ...this._values, [name]: value };
  }

  private async _submit(): Promise<void> {
    this._error = "";
    const amount = parseNumber(this._values.amount ?? "");
    if (amount === null || amount <= 0) {
      this._error = t(this.hass, "expense.amount", { currency: this.currency });
      return;
    }
    const payload: Record<string, unknown> = {
      label: (this._values.label ?? "").trim(),
      amount,
      category_id: this._values.category_id,
      interval_months: Number(this._values.interval_months || 1),
      start_date: this._values.start_date || todayIso(),
      end_date: this._values.end_date || null,
      active: Boolean(this._values.active),
    };
    if (this._entry) payload.recurring_id = this._entry.id;
    this._busy = true;
    try {
      await saveRecurring(this.hass, this.vehicle.id, payload);
      this.close();
      this.dispatchEvent(new CustomEvent("saved", { bubbles: true, composed: true }));
    } catch (err) {
      this._error = t(this.hass, "common.error", { message: (err as Error).message });
    } finally {
      this._busy = false;
    }
  }

  protected override render() {
    if (!this.vehicle) return nothing;
    const hass = this.hass;
    const v = this._values;
    const title = t(hass, this._entry ? "recurring.title_edit" : "recurring.title_new");
    const input = (name: string) => (e: Event) =>
      this._set(name, (e.target as HTMLInputElement | HTMLSelectElement).value);
    return html`<dialog aria-labelledby="recurring-title">
      <form
        method="dialog"
        @submit=${(e: Event) => {
          e.preventDefault();
          void this._submit();
        }}
      >
        <header>
          <h2 id="recurring-title">${title} · ${this.vehicle.name}</h2>
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
          <p class="help" id="recurring-help">${t(hass, "recurring.help")}</p>
          <div class="field">
            <label for="label">${t(hass, "recurring.label")}</label>
            <input
              id="label"
              required
              maxlength="100"
              autocomplete="off"
              aria-describedby="recurring-help"
              .value=${v.label ?? ""}
              @input=${input("label")}
            />
          </div>
          <div class="grid">
            <div class="field">
              <label for="amount">${t(hass, "expense.amount", { currency: this.currency })}</label>
              <input
                id="amount"
                inputmode="decimal"
                autocomplete="off"
                required
                .value=${v.amount ?? ""}
                @input=${input("amount")}
              />
            </div>
            <div class="field">
              <label for="interval">${t(hass, "recurring.interval")}</label>
              <select id="interval" @change=${input("interval_months")}>
                ${INTERVALS.map(
                  (n) =>
                    html`<option value=${n} ?selected=${String(n) === v.interval_months}>
                      ${t(hass, `recurring.interval_${n}` as Key)}
                    </option>`,
                )}
              </select>
            </div>
            <div class="field">
              <label for="category">${t(hass, "expense.category")}</label>
              <select id="category" @change=${input("category_id")}>
                ${this.categories.map(
                  (c) =>
                    html`<option value=${c.id} ?selected=${c.id === v.category_id}>
                      ${c.label}
                    </option>`,
                )}
              </select>
            </div>
            <div class="field">
              <label for="start">${t(hass, "recurring.start")}</label>
              <input
                id="start"
                type="date"
                required
                .value=${v.start_date ?? ""}
                @change=${input("start_date")}
              />
            </div>
            <div class="field">
              <label for="end">${t(hass, "recurring.end")}</label>
              <input
                id="end"
                type="date"
                aria-describedby="end-hint"
                min=${v.start_date ?? nothing}
                .value=${v.end_date ?? ""}
                @change=${input("end_date")}
              />
              <span class="hint" id="end-hint">${t(hass, "common.optional")}</span>
            </div>
          </div>
          <label class="check">
            <input
              type="checkbox"
              .checked=${Boolean(v.active)}
              @change=${(e: Event) =>
                this._set("active", (e.target as HTMLInputElement).checked ? "1" : "")}
            />
            ${t(hass, "recurring.active")}
          </label>
          ${this._error ? html`<p class="error" role="alert">${this._error}</p>` : nothing}
        </div>
        <footer>
          <button type="button" @click=${() => this.close()}>${t(hass, "common.cancel")}</button>
          <button type="submit" class="primary" ?disabled=${this._busy}>
            ${t(hass, "common.save")}
          </button>
        </footer>
      </form>
    </dialog>`;
  }
}
