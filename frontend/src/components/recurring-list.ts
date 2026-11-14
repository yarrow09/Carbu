// Liste des dépenses récurrentes d'un véhicule : montant, périodicité, échéance.
import { css, html, LitElement, nothing } from "lit";

import { deleteRecurring, fetchRecurring } from "../api";
import { money, shortDate } from "../format";
import { t, type Key } from "../i18n";
import { mdiDelete, mdiPencil, sharedStyles } from "../styles";
import type { Category, HomeAssistant, RecurringView, VehicleView } from "../types";
import type { VlConfirmDialog } from "./confirm-dialog";
import { icon } from "./icon";
import type { VlRecurringDialog } from "./recurring-dialog";

export class VlRecurringList extends LitElement {
  static override properties = {
    hass: { attribute: false },
    vehicle: { attribute: false },
    categories: { attribute: false },
    currency: { type: String },
    _items: { state: true },
  };
  static override styles = [
    sharedStyles,
    css`
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 0;
        border-bottom: 1px solid var(--vl-border);
      }
      li:last-child {
        border-bottom: none;
      }
      .dot {
        flex: none;
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      .main {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      .sub {
        font-size: 0.875rem;
        color: var(--vl-muted);
      }
      .amount {
        flex: none;
        text-align: right;
        font-variant-numeric: tabular-nums;
        display: flex;
        flex-direction: column;
      }
      .actions {
        display: flex;
        flex: none;
      }
      li.off .main,
      li.off .amount {
        opacity: 0.7;
      }
      .total {
        margin: 6px 0 0;
        font-size: 0.875rem;
        color: var(--vl-muted);
        text-align: right;
      }
    `,
  ];

  declare hass: HomeAssistant;
  declare vehicle: VehicleView;
  declare categories: Category[];
  declare currency: string;
  declare _items: RecurringView[];

  constructor() {
    super();
    this.categories = [];
    this.currency = "EUR";
    this._items = [];
  }

  async reload(): Promise<void> {
    if (!this.vehicle) return;
    this._items = await fetchRecurring(this.hass, this.vehicle.id);
  }

  protected override updated(changed: Map<string, unknown>): void {
    if (changed.has("vehicle") && this.vehicle) void this.reload();
  }

  /** Ouvrir le formulaire (nouvelle récurrence ou modification). */
  openEditor(item: RecurringView | null = null): void {
    void (this.renderRoot.querySelector("vl-recurring-dialog") as VlRecurringDialog).open(item);
  }

  private _changed(): void {
    void this.reload();
    // Les échéances passées viennent d'être ajoutées au journal.
    this.dispatchEvent(new CustomEvent("saved", { bubbles: true, composed: true }));
  }

  private async _delete(item: RecurringView): Promise<void> {
    const confirm = this.renderRoot.querySelector("vl-confirm-dialog") as VlConfirmDialog;
    if (await confirm.ask(t(this.hass, "recurring.delete_confirm", { label: item.label }))) {
      await deleteRecurring(this.hass, this.vehicle.id, item.id);
      await this.reload();
    }
  }

  private _status(item: RecurringView): string {
    const hass = this.hass;
    const every = t(hass, `recurring.interval_${item.interval_months}` as Key);
    if (!item.active) return `${every} · ${t(hass, "recurring.paused")}`;
    if (!item.next_date) return `${every} · ${t(hass, "recurring.ended")}`;
    return `${every} · ${t(hass, "recurring.next", { date: shortDate(hass, item.next_date) })}`;
  }

  protected override render() {
    if (!this.vehicle) return nothing;
    const hass = this.hass;
    const running = this._items.filter((r) => r.active && r.next_date);
    const monthly = running.reduce((sum, r) => sum + r.monthly_amount, 0);
    return html`
      ${this._items.length
        ? html`<ul>
              ${this._items.map((r) => {
                const category = this.categories.find((c) => c.id === r.category_id);
                const on = r.active && r.next_date !== null;
                return html`<li class=${on ? "" : "off"}>
                  <span
                    class="dot"
                    style="background:${category?.color ?? "#757575"}"
                    aria-hidden="true"
                  ></span>
                  <div class="main">
                    <span>${r.label}</span>
                    <span class="sub">${category?.label ?? r.category_id} · ${this._status(r)}</span>
                  </div>
                  <span class="amount">
                    <span>${money(hass, r.amount, this.currency)}</span>
                    ${r.interval_months > 1
                      ? html`<span class="sub">
                          ${t(hass, "recurring.per_month", {
                            amount: money(hass, r.monthly_amount, this.currency),
                          })}
                        </span>`
                      : nothing}
                  </span>
                  <span class="actions">
                    <button
                      class="icon"
                      aria-label="${t(hass, "common.edit")} : ${r.label}"
                      @click=${() => this.openEditor(r)}
                    >
                      ${icon(mdiPencil)}
                    </button>
                    <button
                      class="icon"
                      aria-label="${t(hass, "common.delete")} : ${r.label}"
                      @click=${() => this._delete(r)}
                    >
                      ${icon(mdiDelete)}
                    </button>
                  </span>
                </li>`;
              })}
            </ul>
            ${running.length > 1
              ? html`<p class="total">
                  ${t(hass, "recurring.total_month", {
                    amount: money(hass, monthly, this.currency),
                  })}
                </p>`
              : nothing}`
        : html`<p class="empty">${t(hass, "recurring.none")}</p>`}
      <vl-recurring-dialog
        .hass=${hass}
        .vehicle=${this.vehicle}
        .categories=${this.categories}
        .currency=${this.currency}
        @saved=${(e: Event) => {
          e.stopPropagation();
          this._changed();
        }}
      ></vl-recurring-dialog>
      <vl-confirm-dialog .hass=${hass}></vl-confirm-dialog>
    `;
  }
}
