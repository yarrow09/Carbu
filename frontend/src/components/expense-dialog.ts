// Saisie / modification d'une dépense, avec pièce jointe facultative.
import { html, LitElement, nothing } from "lit";

import {
  attachmentUrl,
  removeAttachment,
  saveExpense,
  uploadAttachment,
} from "../api";
import { inputNumber, parseNumber, todayIso } from "../format";
import { t } from "../i18n";
import { mdiClose, mdiPaperclip, sharedStyles } from "../styles";
import type { Category, ExpenseView, HomeAssistant, VehicleView } from "../types";
import { dialogStyles } from "./dialog-styles";
import { icon } from "./icon";

export class VlExpenseDialog extends LitElement {
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
  declare _entry: ExpenseView | null;
  private _file: File | null = null;

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

  async open(entry: ExpenseView | null = null): Promise<void> {
    this._entry = entry;
    this._error = "";
    this._file = null;
    this._values = entry
      ? {
          date: entry.date,
          amount: inputNumber(this.hass, entry.amount, 2),
          category_id: entry.category_id,
          odometer: entry.odometer !== null ? inputNumber(this.hass, entry.odometer, 0) : "",
          description: entry.description,
        }
      : { date: todayIso(), category_id: "maintenance" };
    if (!this.categories.some((c) => c.id === this._values.category_id)) {
      this._values = { ...this._values, category_id: this.categories[0]?.id ?? "other" };
    }
    await this.updateComplete;
    const fileInput = this.renderRoot.querySelector<HTMLInputElement>("#attachment");
    if (fileInput) fileInput.value = "";
    this._dialog.showModal();
    this.renderRoot.querySelector<HTMLInputElement>("#amount")?.focus();
  }

  close(): void {
    this._dialog?.close();
  }

  private _set(name: string, value: string): void {
    this._values = { ...this._values, [name]: value };
  }

  private _saved(): void {
    this.dispatchEvent(new CustomEvent("saved", { bubbles: true, composed: true }));
  }

  private async _submit(): Promise<void> {
    this._error = "";
    const amount = parseNumber(this._values.amount ?? "");
    if (amount === null) {
      this._error = t(this.hass, "expense.amount", { currency: this.currency });
      return;
    }
    const odometer = parseNumber(this._values.odometer ?? "");
    const payload: Record<string, unknown> = {
      amount,
      category_id: this._values.category_id,
      description: this._values.description ?? "",
      date: this._values.date || todayIso(),
      odometer,
    };
    if (this._entry) payload.expense_id = this._entry.id;
    this._busy = true;
    try {
      const expense = await saveExpense(this.hass, this.vehicle.id, payload);
      if (this._file) {
        try {
          await uploadAttachment(this.hass, this.vehicle.id, expense.id, this._file);
        } catch (err) {
          // La dépense est enregistrée : on le signale sans la perdre.
          this._entry = expense;
          this._error = t(this.hass, "expense.attachment_error", {
            code: (err as Error).message,
          });
          this._saved();
          return;
        }
      }
      this.close();
      this._saved();
    } catch (err) {
      this._error = t(this.hass, "common.error", { message: (err as Error).message });
    } finally {
      this._busy = false;
    }
  }

  private async _viewAttachment(): Promise<void> {
    if (!this._entry) return;
    const url = await attachmentUrl(this.hass, this.vehicle.id, this._entry.id);
    window.open(url, "_blank", "noopener");
  }

  private async _removeAttachment(): Promise<void> {
    if (!this._entry) return;
    await removeAttachment(this.hass, this.vehicle.id, this._entry.id);
    this._entry = { ...this._entry, attachment: null };
    this._saved();
  }

  protected override render() {
    if (!this.vehicle) return nothing;
    const hass = this.hass;
    const title = t(hass, this._entry ? "expense.title_edit" : "expense.title_new");
    return html`<dialog aria-labelledby="expense-title">
      <form
        method="dialog"
        @submit=${(e: Event) => {
          e.preventDefault();
          void this._submit();
        }}
      >
        <header>
          <h2 id="expense-title">${title} · ${this.vehicle.name}</h2>
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
              <label for="amount">${t(hass, "expense.amount", { currency: this.currency })}</label>
              <input
                id="amount"
                inputmode="decimal"
                autocomplete="off"
                required
                .value=${this._values.amount ?? ""}
                @input=${(e: Event) => this._set("amount", (e.target as HTMLInputElement).value)}
              />
            </div>
            <div class="field">
              <label for="category">${t(hass, "expense.category")}</label>
              <select
                id="category"
                @change=${(e: Event) =>
                  this._set("category_id", (e.target as HTMLSelectElement).value)}
              >
                ${this.categories.map(
                  (c) =>
                    html`<option value=${c.id} ?selected=${c.id === this._values.category_id}>
                      ${c.label}
                    </option>`,
                )}
              </select>
            </div>
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
              <label for="odometer">
                ${t(hass, "expense.odometer", { unit: this.vehicle.units.distance })}
              </label>
              <input
                id="odometer"
                inputmode="decimal"
                autocomplete="off"
                aria-describedby="odometer-hint"
                .value=${this._values.odometer ?? ""}
                @input=${(e: Event) => this._set("odometer", (e.target as HTMLInputElement).value)}
              />
              <span class="hint" id="odometer-hint">${t(hass, "common.optional")}</span>
            </div>
          </div>
          <div class="field">
            <label for="description">${t(hass, "expense.description")}</label>
            <textarea
              id="description"
              .value=${this._values.description ?? ""}
              @input=${(e: Event) =>
                this._set("description", (e.target as HTMLTextAreaElement).value)}
            ></textarea>
          </div>
          <div class="field">
            <label for="attachment">${t(hass, "expense.attachment")}</label>
            <input
              id="attachment"
              type="file"
              accept="image/jpeg,image/png,image/webp,application/pdf"
              @change=${(e: Event) => {
                this._file = (e.target as HTMLInputElement).files?.[0] ?? null;
              }}
            />
            ${this._entry?.attachment
              ? html`<div class="check">
                  <button type="button" @click=${() => this._viewAttachment()}>
                    ${icon(mdiPaperclip)} ${t(hass, "expense.attachment_view")}
                  </button>
                  <button type="button" class="danger" @click=${() => this._removeAttachment()}>
                    ${t(hass, "expense.attachment_remove")}
                  </button>
                </div>`
              : nothing}
          </div>
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
