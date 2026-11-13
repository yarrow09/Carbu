// Carte principale : vue d'ensemble, saisie rapide, dernières entrées, histogramme.
import { css, html, nothing } from "lit";

import { deleteExpense, deleteFuel, fetchDashboard } from "../api";
import type { VlConfirmDialog } from "../components/confirm-dialog";
import type { VlExpenseDialog } from "../components/expense-dialog";
import type { VlFuelDialog } from "../components/fuel-dialog";
import type { VlReminderList } from "../components/reminder-list";
import { icon } from "../components/icon";
import { money, num, shortDate } from "../format";
import { t } from "../i18n";
import { mdiDelete, mdiPencil, mdiPlus, sharedStyles } from "../styles";
import type { CardConfig, Dashboard, ExpenseView, FuelEntryView } from "../types";
import { VehicleCardBase } from "./base";

export const listStyles = css`
  ul.entries {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  ul.entries li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
    border-bottom: 1px solid var(--vl-border);
  }
  ul.entries li:last-child {
    border-bottom: none;
  }
  .entry-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .entry-title {
    display: flex;
    gap: 8px;
    justify-content: space-between;
    align-items: baseline;
  }
  .entry-title > :first-child {
    min-width: 0;
  }
  .entry-title > .amount {
    flex: none;
  }
  .entry-sub {
    font-size: 0.875rem;
    color: var(--vl-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .amount {
    font-variant-numeric: tabular-nums;
    font-weight: 500;
  }
  .row-actions {
    display: flex;
    flex: none;
  }
`;

export class VehicleLogCard extends VehicleCardBase {
  static override properties = {
    ...VehicleCardBase.properties,
    _data: { state: true },
  };
  static override styles = [
    sharedStyles,
    listStyles,
    css`
      ha-card {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 16px;
      }
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
      }
      h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 500;
      }
      h3 {
        margin: 0 0 4px;
        font-size: 1rem;
        font-weight: 500;
      }
      .actions {
        display: flex;
        gap: 8px;
      }
      .actions button {
        display: inline-flex;
        align-items: center;
        gap: 4px;
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
        gap: 8px;
        margin: 0;
      }
      .tile {
        border: 1px solid var(--vl-border);
        border-radius: 10px;
        padding: 8px 12px;
        display: flex;
        flex-direction: column-reverse;
        margin: 0;
      }
      .tile dt {
        font-size: 0.8125rem;
        color: var(--vl-muted);
      }
      .tile dd {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
      }
      .tile dd small {
        font-size: 0.8125rem;
        font-weight: 400;
        color: var(--vl-muted);
      }
      .recent {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
        gap: 16px;
      }
    `,
  ];

  declare _data: Dashboard | null;

  constructor() {
    super();
    this._data = null;
  }

  static getStubConfig(): CardConfig {
    return { type: "custom:carbu-card" };
  }

  static async getConfigElement(): Promise<HTMLElement> {
    const editor = document.createElement("carbu-card-editor");
    editor.setAttribute("kind", "dashboard");
    return editor;
  }

  getCardSize(): number {
    return 8;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }

  protected async loadVehicleData(): Promise<void> {
    const vehicle = this.vehicle;
    this._data = vehicle ? await fetchDashboard(this.hass, vehicle.id) : null;
    await (this.renderRoot.querySelector("vl-reminder-list") as VlReminderList | null)?.reload();
  }

  private _dialog<T>(selector: string): T {
    return this.renderRoot.querySelector(selector) as T;
  }

  private async _deleteFuel(entry: FuelEntryView): Promise<void> {
    const ok = await this._dialog<VlConfirmDialog>("vl-confirm-dialog").ask(
      t(this.hass, "fuel.delete_confirm", { date: shortDate(this.hass, entry.date) }),
    );
    if (ok && this._data) {
      await deleteFuel(this.hass, this._data.id, entry.id);
      await this.reload();
    }
  }

  private async _deleteExpense(expense: ExpenseView): Promise<void> {
    const ok = await this._dialog<VlConfirmDialog>("vl-confirm-dialog").ask(
      t(this.hass, "expense.delete_confirm", {
        date: shortDate(this.hass, expense.date),
        amount: money(this.hass, expense.amount, this._currency),
      }),
    );
    if (ok && this._data) {
      await deleteExpense(this.hass, this._data.id, expense.id);
      await this.reload();
    }
  }

  private _tiles(data: Dashboard) {
    const hass = this.hass;
    const s = data.summary;
    const fuel = data.fuel_types[0];
    const unit = data.units.distance;
    const tile = (label: string, value: string, suffix = "") =>
      html`<div class="tile">
        <dt>${label}</dt>
        <dd>${value}${suffix ? html` <small>${suffix}</small>` : nothing}</dd>
      </div>`;
    return html`<dl class="tiles">
      ${tile(
        t(hass, "tile.consumption"),
        num(hass, s?.consumption[fuel], 2),
        data.units.consumption[fuel],
      )}
      ${tile(t(hass, "tile.month_cost"), money(hass, s?.month_cost, data.currency))}
      ${tile(
        t(hass, "tile.cost_per_distance", { unit }),
        money(hass, s?.cost_per_distance, data.currency, 3),
      )}
      ${tile(t(hass, "tile.odometer"), num(hass, s?.current_odometer, 0), unit)}
      ${tile(t(hass, "tile.distance_month"), num(hass, s?.distance_month, 0), unit)}
    </dl>`;
  }

  private _fuelRow(data: Dashboard, e: FuelEntryView) {
    const hass = this.hass;
    const volumeUnit = data.units.volume[e.fuel_type] ?? "L";
    const label = `${shortDate(hass, e.date)} · ${num(hass, e.volume, 2)} ${volumeUnit}`;
    return html`<li>
      <div class="entry-main">
        <span class="entry-title">
          <span>${label}${e.full_tank ? nothing : html` <span class="badge">${t(hass, "fuel.partial")}</span>`}</span>
          <span class="amount">${money(hass, e.total_cost, data.currency)}</span>
        </span>
        <span class="entry-sub">
          ${num(hass, e.odometer, 0)} ${data.units.distance} ·
          ${money(hass, e.unit_price, data.currency, 3)}/${volumeUnit}${e.station ? ` · ${e.station}` : ""}
        </span>
      </div>
      <span class="row-actions">
        <button
          class="icon"
          aria-label="${t(hass, "common.edit")} : ${label}"
          @click=${() => this._dialog<VlFuelDialog>("vl-fuel-dialog").open(e)}
        >
          ${icon(mdiPencil)}
        </button>
        <button
          class="icon"
          aria-label="${t(hass, "common.delete")} : ${label}"
          @click=${() => this._deleteFuel(e)}
        >
          ${icon(mdiDelete)}
        </button>
      </span>
    </li>`;
  }

  private _expenseRow(data: Dashboard, e: ExpenseView) {
    const hass = this.hass;
    const category = data.categories.find((c) => c.id === e.category_id);
    const label = `${shortDate(hass, e.date)} · ${category?.label ?? e.category_id}`;
    return html`<li>
      <div class="entry-main">
        <span class="entry-title">
          <span>${label}</span>
          <span class="amount">${money(hass, e.amount, data.currency)}</span>
        </span>
        ${e.description ? html`<span class="entry-sub">${e.description}</span>` : nothing}
      </div>
      <span class="row-actions">
        <button
          class="icon"
          aria-label="${t(hass, "common.edit")} : ${label}"
          @click=${() => this._dialog<VlExpenseDialog>("vl-expense-dialog").open(e)}
        >
          ${icon(mdiPencil)}
        </button>
        <button
          class="icon"
          aria-label="${t(hass, "common.delete")} : ${label}"
          @click=${() => this._deleteExpense(e)}
        >
          ${icon(mdiDelete)}
        </button>
      </span>
    </li>`;
  }

  protected override render() {
    const hass = this.hass;
    if (this._loading) return html`<ha-card><p>${t(hass, "common.loading")}</p></ha-card>`;
    if (this._error) {
      const message =
        this._error === "not_loaded" ? t(hass, "common.not_loaded") : this._error;
      return html`<ha-card><p class="error" role="alert">${message}</p></ha-card>`;
    }
    const data = this._data;
    if (!data) return html`<ha-card><p>${t(hass, "common.no_vehicle")}</p></ha-card>`;
    const config = this._config;
    return html`<ha-card>
      <div class="head">
        <h2>${config.title || data.name}</h2>
        <div class="actions">
          <button
            class="primary"
            aria-label=${t(hass, "action.add_fuel_long")}
            @click=${() => this._dialog<VlFuelDialog>("vl-fuel-dialog").open()}
          >
            ${icon(mdiPlus)} ${t(hass, "action.add_fuel")}
          </button>
          <button
            aria-label=${t(hass, "action.add_expense_long")}
            @click=${() => this._dialog<VlExpenseDialog>("vl-expense-dialog").open()}
          >
            ${icon(mdiPlus)} ${t(hass, "action.add_expense")}
          </button>
        </div>
      </div>
      ${this._tiles(data)}
      ${config.show_reminders !== false
        ? html`<section aria-labelledby="reminders">
            <div class="head">
              <h3 id="reminders">${t(hass, "reminders.title")}</h3>
              <button
                aria-label=${t(hass, "reminders.add_long")}
                @click=${() =>
                  (this.renderRoot.querySelector("vl-reminder-list") as VlReminderList).openEditor()}
              >
                ${icon(mdiPlus)} ${t(hass, "reminders.add")}
              </button>
            </div>
            <vl-reminder-list .hass=${hass} .vehicle=${data}></vl-reminder-list>
          </section>`
        : nothing}
      ${config.show_recent
        ? html`<div class="recent">
            <section aria-labelledby="recent-fuel">
              <h3 id="recent-fuel">${t(hass, "section.recent_fuel")}</h3>
              ${data.recent_fuel.length
                ? html`<ul class="entries">${data.recent_fuel.map((e) => this._fuelRow(data, e))}</ul>`
                : html`<p class="empty">${t(hass, "common.none")}</p>`}
            </section>
            <section aria-labelledby="recent-expenses">
              <h3 id="recent-expenses">${t(hass, "section.recent_expenses")}</h3>
              ${data.recent_expenses.length
                ? html`<ul class="entries">
                    ${data.recent_expenses.map((e) => this._expenseRow(data, e))}
                  </ul>`
                : html`<p class="empty">${t(hass, "common.none")}</p>`}
            </section>
          </div>`
        : nothing}
      ${config.show_chart
        ? html`<section aria-labelledby="monthly">
            <h3 id="monthly">${t(hass, "section.monthly")}</h3>
            <vl-monthly-chart
              .hass=${hass}
              .data=${data.monthly}
              .categories=${data.categories}
              .currency=${data.currency}
            ></vl-monthly-chart>
          </section>`
        : nothing}
      <vl-fuel-dialog
        .hass=${hass}
        .vehicle=${data}
        .currency=${data.currency}
        @saved=${() => this.reload()}
      ></vl-fuel-dialog>
      <vl-expense-dialog
        .hass=${hass}
        .vehicle=${data}
        .categories=${data.categories}
        .currency=${data.currency}
        @saved=${() => this.reload()}
      ></vl-expense-dialog>
      <vl-confirm-dialog .hass=${hass}></vl-confirm-dialog>
    </ha-card>`;
  }
}
