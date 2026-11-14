// Carte principale : vue d'ensemble, saisie rapide, dernières entrées, histogramme.
import { css, html, nothing } from "lit";

import { deleteExpense, deleteFuel, fetchDashboard } from "../api";
import type { VlConfirmDialog } from "../components/confirm-dialog";
import type { VlExpenseDialog } from "../components/expense-dialog";
import type { VlFuelDialog } from "../components/fuel-dialog";
import type { VlRecurringList } from "../components/recurring-list";
import type { VlReminderList } from "../components/reminder-list";
import { icon } from "../components/icon";
import { kpi, kpiStyles } from "../components/kpi";
import { fuelDetails, gradeLabel, money, num, shortDate } from "../format";
import { t } from "../i18n";
import {
  listStyles,
  mdiBellOutline,
  mdiCalendarClock,
  mdiCashMultiple,
  mdiChartBellCurveCumulative,
  mdiCurrencyEur,
  mdiDelete,
  mdiGasStation,
  mdiGasStationOutline,
  mdiMapMarkerDistance,
  mdiPencil,
  mdiPlus,
  mdiRepeat,
  mdiSpeedometer,
  sharedStyles,
} from "../styles";
import type { CardConfig, Dashboard, ExpenseView, FuelEntryView } from "../types";
import { VehicleCardBase } from "./base";


export class VehicleLogCard extends VehicleCardBase {
  static override properties = {
    ...VehicleCardBase.properties,
    _data: { state: true },
  };
  static override styles = [
    sharedStyles,
    listStyles,
    kpiStyles,
    css`
      ha-card {
        padding: 18px;
        display: flex;
        flex-direction: column;
        gap: 20px;
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
        font-size: 1.35rem;
        font-weight: 600;
        letter-spacing: -0.01em;
      }
      .sub {
        color: var(--vl-muted);
        font-size: 0.875rem;
      }
      .actions {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .hero {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 240px), 1fr));
        gap: 12px;
      }
      .panel {
        position: relative;
        overflow: hidden;
        border-radius: 16px;
        padding: 14px 16px;
        display: flex;
        flex-direction: column;
        gap: 10px;
        background: var(--vl-surface);
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      }
      /* Liseré dégradé en haut des encarts. */
      .panel::before {
        content: "";
        position: absolute;
        inset: 0 0 auto;
        height: 3px;
        background: var(--vl-gradient);
        opacity: 0.85;
      }
      .panel.next::before {
        background: linear-gradient(90deg, #ffb300, #ff7043);
      }
      .panel-head {
        display: flex;
        flex-wrap: wrap;
        align-items: baseline;
        justify-content: space-between;
        gap: 4px 12px;
      }
      .hint {
        margin: 0;
        color: var(--vl-muted);
        font-size: 0.8125rem;
      }
      .figures {
        display: flex;
        flex-wrap: wrap;
        gap: 8px 28px;
        margin: 0;
      }
      .figure {
        display: flex;
        flex-direction: column-reverse;
        margin: 0;
      }
      .figure dt {
        font-size: 0.8125rem;
        color: var(--vl-muted);
      }
      .figure dd {
        margin: 0;
        font-size: 1.9rem;
        font-weight: 650;
        line-height: 1.15;
        letter-spacing: -0.02em;
        font-variant-numeric: tabular-nums;
      }
      .figure dd small {
        font-size: 0.875rem;
        font-weight: 400;
        letter-spacing: 0;
        color: var(--vl-muted);
      }
      .delta {
        display: inline-block;
        margin-left: 4px;
        font-size: 0.75rem;
        padding: 0 6px;
        border-radius: 999px;
        background: var(--vl-surface-strong);
      }
      .delta.up {
        color: var(--vl-warning-text);
      }
      .delta.down {
        color: color-mix(in srgb, var(--success-color, #43a047) 70%, var(--primary-text-color));
      }
      .countdown {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .ring {
        --p: 0;
        flex: none;
        width: 58px;
        height: 58px;
        border-radius: 50%;
        display: grid;
        place-items: center;
        background:
          radial-gradient(closest-side, var(--card-background-color, #1c1c1c) 76%, transparent 78%),
          conic-gradient(#ffb300 calc(var(--p) * 1%), var(--vl-surface-strong) 0);
        font-weight: 650;
        font-variant-numeric: tabular-nums;
      }
      .ring small {
        display: block;
        font-size: 0.6875rem;
        font-weight: 400;
        color: var(--vl-muted);
        text-align: center;
        line-height: 1;
      }
      .countdown .when {
        display: flex;
        flex-direction: column;
      }
      .countdown .when strong {
        font-size: 1.1rem;
      }
      .overdue {
        color: var(--vl-warning-text);
      }
      section {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .section-head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
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
    await Promise.all([
      (this.renderRoot.querySelector("vl-reminder-list") as VlReminderList | null)?.reload(),
      (this.renderRoot.querySelector("vl-recurring-list") as VlRecurringList | null)?.reload(),
    ]);
  }

  /** Ouvrir la saisie d'un plein (aussi appelé par la barre d'outils de la page). */
  openFuel(): void {
    void this._dialog<VlFuelDialog>("vl-fuel-dialog")?.open();
  }

  /** Ouvrir la saisie d'une dépense. */
  openExpense(): void {
    void this._dialog<VlExpenseDialog>("vl-expense-dialog")?.open();
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
    return html`<dl class="kpis">
      ${kpi(t(hass, "tile.consumption"), num(hass, s?.consumption[fuel], 2), data.units.consumption[fuel], {
        icon: mdiGasStation,
        color: "#26c6da",
        index: 0,
      })}
      ${kpi(t(hass, "tile.month_cost"), money(hass, s?.month_cost, data.currency), "", {
        icon: mdiCashMultiple,
        color: "#ffb300",
        index: 1,
      })}
      ${kpi(
        t(hass, "tile.cost_per_distance", { unit }),
        money(hass, s?.cost_per_distance, data.currency, 3),
        "",
        { icon: mdiCurrencyEur, color: "#ab47bc", index: 2 },
      )}
      ${kpi(t(hass, "tile.odometer"), num(hass, s?.current_odometer, 0), unit, {
        icon: mdiSpeedometer,
        color: "#5c6bc0",
        index: 3,
      })}
      ${kpi(t(hass, "tile.distance_month"), num(hass, s?.distance_month, 0), unit, {
        icon: mdiMapMarkerDistance,
        color: "#66bb6a",
        index: 4,
      })}
    </dl>`;
  }

  /** Encarts « Dernier plein » et « Prochain plein estimé ». */
  private _hero(data: Dashboard) {
    const last = this._config.show_last_fill !== false ? this._lastFill(data) : nothing;
    const next = this._config.show_next_fill !== false ? this._nextFill(data) : nothing;
    if (last === nothing && next === nothing) return nothing;
    return html`<div class="hero">${last}${next}</div>`;
  }

  /** Dernier plein : distance parcourue et consommation mesurée. */
  private _lastFill(data: Dashboard) {
    const hass = this.hass;
    const e = data.last_fuel;
    if (!e) return nothing;
    const volumeUnit = data.units.volume[e.fuel_type] ?? "L";
    const consumptionUnit = data.units.consumption[e.fuel_type] ?? "";
    const average = data.summary?.consumption[e.fuel_type] ?? null;
    // Écart à la moyenne, dans le sens « consomme plus » (L/100 km) ou « parcourt
    // moins » (km/L, mpg) : seules les unités en volume par distance montent.
    const perDistance = /\/100/.test(consumptionUnit);
    let delta: unknown = nothing;
    if (e.consumption != null && average != null && average > 0) {
      const diff = e.consumption - average;
      const worse = perDistance ? diff > 0 : diff < 0;
      if (Math.abs(diff) >= 0.005) {
        delta = html`<span class="delta ${worse ? "up" : "down"}">
          ${t(hass, worse ? "last_fill.worse" : "last_fill.better", {
            value: num(hass, Math.abs(diff), 2),
          })}
        </span>`;
      }
    }
    return html`<section class="panel rise" style="--i:0" aria-labelledby="last-fill">
      <div class="panel-head">
        <h3 class="section" id="last-fill">${icon(mdiGasStation)} ${t(hass, "last_fill.title")}</h3>
        <span class="sub">
          ${shortDate(hass, e.date)} · ${num(hass, e.volume, 2)} ${volumeUnit}${e.grade
            ? ` ${gradeLabel(e.grade)}`
            : ""} · ${money(hass, e.total_cost, data.currency)}
        </span>
      </div>
      <dl class="figures">
        <div class="figure">
          <dt>${t(hass, "last_fill.distance")}</dt>
          <dd>${num(hass, e.distance, 0)} <small>${data.units.distance}</small></dd>
        </div>
        <div class="figure">
          <dt>${t(hass, "last_fill.consumption")} ${delta}</dt>
          <dd>${num(hass, e.consumption, 2)} <small>${consumptionUnit}</small></dd>
        </div>
      </dl>
      ${e.full_tank ? nothing : html`<p class="hint">${t(hass, "last_fill.partial")}</p>`}
    </section>`;
  }

  /** Prochain plein estimé : compte à rebours, kilométrage, quantité, montant. */
  private _nextFill(data: Dashboard) {
    const hass = this.hass;
    const n = data.summary?.next_fill;
    const title = html`<h3 class="section" id="next-fill">
      ${icon(mdiCalendarClock)} ${t(hass, "next_fill.title")}
    </h3>`;
    if (!n) {
      return html`<section class="panel next rise" style="--i:1" aria-labelledby="next-fill">
        ${title}
        <p class="hint">${t(hass, "next_fill.unknown")}</p>
      </section>`;
    }
    const unit = data.units.distance;
    const volumeUnit = data.units.volume[n.fuel_type] ?? "L";
    // Avancement depuis le dernier plein, pour l'anneau.
    const progress = n.interval > 0 ? 100 * (1 - n.distance_left / n.interval) : 0;
    const days = Math.max(0, n.days_left);
    const when = n.overdue
      ? t(hass, "next_fill.overdue")
      : days === 0
        ? t(hass, "next_fill.today")
        : t(hass, "next_fill.in_days", { days });
    const details = [
      t(hass, "next_fill.around", { odometer: `${num(hass, n.odometer, 0)} ${unit}` }),
      n.volume !== null ? `≈ ${num(hass, n.volume, 0)} ${volumeUnit}` : "",
      n.cost !== null ? `≈ ${money(hass, n.cost, data.currency, 0)}` : "",
    ].filter(Boolean);
    return html`<section class="panel next rise" style="--i:1" aria-labelledby="next-fill">
      <div class="panel-head">
        ${title}
        <span class="sub">${shortDate(hass, n.date)}</span>
      </div>
      <div class="countdown">
        <div
          class="ring"
          style="--p:${Math.min(100, Math.max(0, progress)).toFixed(0)}"
          role="img"
          aria-label=${t(hass, "next_fill.progress", { percent: Math.round(progress) })}
        >
          <span>${num(hass, n.distance_left, 0)}<small>${unit}</small></span>
        </div>
        <div class="when">
          <strong class=${n.overdue ? "overdue" : ""}>${when}</strong>
          <span class="sub">${details.join(" · ")}</span>
        </div>
      </div>
      <p class="hint">
        ${t(hass, "next_fill.basis", {
          interval: `${num(hass, n.interval, 0)} ${unit}`,
          rate: `${num(hass, n.distance_per_day, 0)} ${unit}`,
        })}
      </p>
    </section>`;
  }

  private _fuelRow(data: Dashboard, e: FuelEntryView) {
    const hass = this.hass;
    const volumeUnit = data.units.volume[e.fuel_type] ?? "L";
    const grade = e.grade ? ` ${gradeLabel(e.grade)}` : "";
    const label = `${shortDate(hass, e.date)} · ${num(hass, e.volume, 2)} ${volumeUnit}${grade}`;
    return html`<li>
      <div class="entry-main">
        <span class="entry-title">
          <span>${label}${e.full_tank ? nothing : html` <span class="badge">${t(hass, "fuel.partial")}</span>`}</span>
          <span class="amount">${money(hass, e.total_cost, data.currency)}</span>
        </span>
        <span class="entry-sub">${fuelDetails(hass, data, e, data.currency)}</span>
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
    const subtitle = [data.make, data.model].filter(Boolean).join(" ");
    const sectionHead = (id: string, path: string, title: string, add?: () => void, addLabel = "", addLong = "") =>
      html`<div class="section-head">
        <h3 class="section" id=${id}>${icon(path)} ${title}</h3>
        ${add
          ? html`<button aria-label=${addLong} @click=${add}>${icon(mdiPlus)} ${addLabel}</button>`
          : nothing}
      </div>`;
    return html`<ha-card>
      <div class="head">
        <div>
          <h2>${config.title || data.name}</h2>
          ${subtitle && !config.title ? html`<span class="sub">${subtitle}</span>` : nothing}
        </div>
        ${config.show_actions === false
          ? nothing
          : html`<div class="actions">
          <button class="primary" aria-label=${t(hass, "action.add_fuel_long")} @click=${() => this.openFuel()}>
            ${icon(mdiPlus)} ${t(hass, "action.add_fuel")}
          </button>
          <button aria-label=${t(hass, "action.add_expense_long")} @click=${() => this.openExpense()}>
            ${icon(mdiPlus)} ${t(hass, "action.add_expense")}
          </button>
        </div>`}
      </div>
      ${this._hero(data)}
      ${this._tiles(data)}
      ${config.show_reminders !== false
        ? html`<section aria-labelledby="reminders">
            ${sectionHead(
              "reminders",
              mdiBellOutline,
              t(hass, "reminders.title"),
              () => (this.renderRoot.querySelector("vl-reminder-list") as VlReminderList).openEditor(),
              t(hass, "reminders.add"),
              t(hass, "reminders.add_long"),
            )}
            <vl-reminder-list .hass=${hass} .vehicle=${data}></vl-reminder-list>
          </section>`
        : nothing}
      ${config.show_recurring !== false
        ? html`<section aria-labelledby="recurring">
            ${sectionHead(
              "recurring",
              mdiRepeat,
              t(hass, "recurring.title"),
              () =>
                (this.renderRoot.querySelector("vl-recurring-list") as VlRecurringList).openEditor(),
              t(hass, "recurring.add"),
              t(hass, "recurring.add_long"),
            )}
            <vl-recurring-list
              .hass=${hass}
              .vehicle=${data}
              .categories=${data.categories}
              .currency=${data.currency}
              @saved=${() => this.reload()}
            ></vl-recurring-list>
          </section>`
        : nothing}
      ${config.show_recent
        ? html`<div class="recent">
            <section aria-labelledby="recent-fuel">
              ${sectionHead("recent-fuel", mdiGasStationOutline, t(hass, "section.recent_fuel"))}
              ${data.recent_fuel.length
                ? html`<ul class="entries">${data.recent_fuel.map((e) => this._fuelRow(data, e))}</ul>`
                : html`<p class="empty">${t(hass, "common.none")}</p>`}
            </section>
            <section aria-labelledby="recent-expenses">
              ${sectionHead("recent-expenses", mdiCashMultiple, t(hass, "section.recent_expenses"))}
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
            ${sectionHead("monthly", mdiChartBellCurveCumulative, t(hass, "section.monthly"))}
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
