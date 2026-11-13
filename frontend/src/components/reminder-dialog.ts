// Création / modification d'un rappel (date, kilométrage ou les deux).
import { css, html, LitElement, nothing } from "lit";

import { saveReminder } from "../api";
import { inputNumber, parseNumber, todayIso } from "../format";
import { t } from "../i18n";
import { mdiClose, sharedStyles } from "../styles";
import type { HomeAssistant, ReminderKind, ReminderView, VehicleView } from "../types";
import { dialogStyles } from "./dialog-styles";
import { icon } from "./icon";

const NUMERIC = [
  "due_odometer",
  "alert_days",
  "alert_distance",
  "interval_days",
  "interval_distance",
] as const;

export class VlReminderDialog extends LitElement {
  static override properties = {
    hass: { attribute: false },
    vehicle: { attribute: false },
    _values: { state: true },
    _error: { state: true },
    _busy: { state: true },
    _entry: { state: true },
  };
  static override styles = [
    sharedStyles,
    dialogStyles,
    css`
      fieldset {
        border: 1px solid var(--vl-border);
        border-radius: 10px;
        padding: 8px 12px 12px;
        margin: 0;
      }
      legend {
        padding: 0 4px;
        color: var(--vl-muted);
      }
    `,
  ];

  declare hass: HomeAssistant;
  declare vehicle: VehicleView;
  declare _values: Record<string, string>;
  declare _error: string;
  declare _busy: boolean;
  declare _entry: ReminderView | null;

  constructor() {
    super();
    this._values = {};
    this._error = "";
    this._busy = false;
    this._entry = null;
  }

  private get _dialog(): HTMLDialogElement {
    return this.renderRoot.querySelector("dialog") as HTMLDialogElement;
  }

  async open(entry: ReminderView | null = null): Promise<void> {
    this._entry = entry;
    this._error = "";
    const n = (v: number | null, digits = 0) =>
      v === null ? "" : inputNumber(this.hass, v, digits);
    this._values = entry
      ? {
          label: entry.label,
          kind: entry.kind,
          due_date: entry.due_date ?? "",
          due_odometer: n(entry.due_odometer),
          alert_days: n(entry.alert_days),
          alert_distance: n(entry.alert_distance),
          interval_days: n(entry.interval_days),
          interval_distance: n(entry.interval_distance),
        }
      : { kind: "both", due_date: todayIso(365), alert_days: "30", alert_distance: "1000" };
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
    const payload: Record<string, unknown> = {
      label: this._values.label ?? "",
      kind: this._values.kind,
      due_date: this._values.due_date || null,
    };
    for (const key of NUMERIC) payload[key] = parseNumber(this._values[key] ?? "");
    if (this._entry) payload.reminder_id = this._entry.id;
    this._busy = true;
    try {
      await saveReminder(this.hass, this.vehicle.id, payload);
      this.close();
      this.dispatchEvent(new CustomEvent("saved", { bubbles: true, composed: true }));
    } catch (err) {
      this._error = t(this.hass, "common.error", { message: (err as Error).message });
    } finally {
      this._busy = false;
    }
  }

  private _number(name: string, label: string, hint?: string) {
    return html`<div class="field">
      <label for=${name}>${label}</label>
      <input
        id=${name}
        inputmode="decimal"
        autocomplete="off"
        aria-describedby=${hint ? `${name}-hint` : nothing}
        .value=${this._values[name] ?? ""}
        @input=${(e: Event) => this._set(name, (e.target as HTMLInputElement).value)}
      />
      ${hint ? html`<span class="hint" id="${name}-hint">${hint}</span>` : nothing}
    </div>`;
  }

  protected override render() {
    if (!this.vehicle) return nothing;
    const hass = this.hass;
    const unit = this.vehicle.units.distance;
    const kind = (this._values.kind ?? "both") as ReminderKind;
    const usesDate = kind !== "distance";
    const usesDistance = kind !== "date";
    const title = t(hass, this._entry ? "reminder.title_edit" : "reminder.title_new");
    const kinds: [ReminderKind, string][] = [
      ["date", t(hass, "reminder.kind_date")],
      ["distance", t(hass, "reminder.kind_distance")],
      ["both", t(hass, "reminder.kind_both")],
    ];
    return html`<dialog aria-labelledby="reminder-title">
      <form
        method="dialog"
        @submit=${(e: Event) => {
          e.preventDefault();
          void this._submit();
        }}
      >
        <header>
          <h2 id="reminder-title">${title} · ${this.vehicle.name}</h2>
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
          <div class="field">
            <label for="label">${t(hass, "reminder.label")}</label>
            <input
              id="label"
              required
              autocomplete="off"
              .value=${this._values.label ?? ""}
              @input=${(e: Event) => this._set("label", (e.target as HTMLInputElement).value)}
            />
          </div>
          <div class="field">
            <label for="kind">${t(hass, "reminder.kind")}</label>
            <select
              id="kind"
              @change=${(e: Event) => this._set("kind", (e.target as HTMLSelectElement).value)}
            >
              ${kinds.map(
                ([value, label]) =>
                  html`<option value=${value} ?selected=${value === kind}>${label}</option>`,
              )}
            </select>
          </div>
          ${usesDate
            ? html`<fieldset>
                <legend>${t(hass, "reminder.kind_date")}</legend>
                <div class="grid">
                  <div class="field">
                    <label for="due_date">${t(hass, "reminder.due_date")}</label>
                    <input
                      id="due_date"
                      type="date"
                      required
                      .value=${this._values.due_date ?? ""}
                      @change=${(e: Event) =>
                        this._set("due_date", (e.target as HTMLInputElement).value)}
                    />
                  </div>
                  ${this._number("alert_days", t(hass, "reminder.alert_days"))}
                  ${this._number(
                    "interval_days",
                    t(hass, "reminder.interval_days"),
                    t(hass, "reminder.recurrence_hint"),
                  )}
                </div>
              </fieldset>`
            : nothing}
          ${usesDistance
            ? html`<fieldset>
                <legend>${t(hass, "reminder.kind_distance")}</legend>
                <div class="grid">
                  ${this._number("due_odometer", t(hass, "reminder.due_odometer", { unit }))}
                  ${this._number("alert_distance", t(hass, "reminder.alert_distance", { unit }))}
                  ${this._number(
                    "interval_distance",
                    t(hass, "reminder.interval_distance", { unit }),
                    t(hass, "reminder.recurrence_hint"),
                  )}
                </div>
              </fieldset>`
            : nothing}
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
