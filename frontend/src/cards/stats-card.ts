// Carte statistiques : période au choix, indicateurs, courbe de consommation.
import { css, html, nothing } from "lit";

import { fetchCategories, fetchStats } from "../api";
import { co2Mass, money, num, shortDate } from "../format";
import { t, type Key } from "../i18n";
import { sharedStyles } from "../styles";
import type { CardConfig, Category, StatsPeriod, StatsView } from "../types";
import { VehicleCardBase } from "./base";

const PERIODS: StatsPeriod[] = ["30d", "3m", "12m", "all"];

export class VehicleLogStatsCard extends VehicleCardBase {
  static override properties = {
    ...VehicleCardBase.properties,
    _period: { state: true },
    _stats: { state: true },
    _categories: { state: true },
  };
  static override styles = [
    sharedStyles,
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
      .periods {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .range {
        color: var(--vl-muted);
        font-size: 0.875rem;
        margin: -8px 0 0;
      }
      dl.tiles {
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
      }
      .tile dt {
        font-size: 0.8125rem;
        color: var(--vl-muted);
      }
      .tile dd {
        margin: 0;
        font-size: 1.2rem;
        font-weight: 500;
        font-variant-numeric: tabular-nums;
      }
      .tile dd small {
        font-size: 0.8125rem;
        font-weight: 400;
        color: var(--vl-muted);
      }
      .groups {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 230px), 1fr));
        gap: 16px;
      }
      .group {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }
      .group dl.tiles {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
      .tile.main {
        grid-column: 1 / -1;
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        border-color: transparent;
      }
      .tile.main dd {
        font-size: 1.6rem;
      }
      .note {
        margin: 0;
        font-size: 0.75rem;
        color: var(--vl-muted);
      }
      .bottom {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 360px), 1fr));
        gap: 16px;
        align-items: start;
      }
      .stack {
        display: flex;
        height: 14px;
        border-radius: 7px;
        overflow: hidden;
        gap: 2px;
        margin: 4px 0 8px;
      }
      .stack span {
        min-width: 3px;
      }
      ul.legend {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 220px), 1fr));
        gap: 4px 24px;
        font-size: 0.875rem;
      }
      ul.legend li {
        display: grid;
        grid-template-columns: auto 1fr auto auto;
        align-items: center;
        gap: 8px;
      }
      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
      }
      .name {
        min-width: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .pct {
        color: var(--vl-muted);
        font-variant-numeric: tabular-nums;
      }
      .amount {
        font-variant-numeric: tabular-nums;
      }
    `,
  ];

  declare _period: StatsPeriod;
  declare _stats: StatsView | null;
  declare _categories: Category[];

  constructor() {
    super();
    this._period = "12m";
    this._stats = null;
    this._categories = [];
  }

  override setConfig(config: CardConfig): void {
    super.setConfig(config);
    if (config.period) this._period = config.period;
  }

  static getStubConfig(): CardConfig {
    return { type: "custom:carbu-stats-card" };
  }

  static async getConfigElement(): Promise<HTMLElement> {
    const editor = document.createElement("carbu-card-editor");
    editor.setAttribute("kind", "stats");
    return editor;
  }

  getCardSize(): number {
    return 7;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }

  protected async loadVehicleData(): Promise<void> {
    const vehicle = this.vehicle;
    if (!vehicle) return;
    const [stats, categories] = await Promise.all([
      fetchStats(this.hass, vehicle.id, this._period),
      fetchCategories(this.hass),
    ]);
    this._stats = stats;
    this._categories = categories;
  }

  private async _select(period: StatsPeriod): Promise<void> {
    this._period = period;
    await this.loadVehicleData();
  }

  protected override render() {
    const hass = this.hass;
    if (this._loading) return html`<ha-card><p>${t(hass, "common.loading")}</p></ha-card>`;
    if (this._error) {
      const message = this._error === "not_loaded" ? t(hass, "common.not_loaded") : this._error;
      return html`<ha-card><p class="error" role="alert">${message}</p></ha-card>`;
    }
    const vehicle = this.vehicle;
    const s = this._stats;
    if (!vehicle || !s) return html`<ha-card><p>${t(hass, "common.no_vehicle")}</p></ha-card>`;
    const unit = vehicle.units.distance;
    const currency = this._currency;
    const multi = vehicle.fuel_types.length > 1;
    const fuelName = (f: string) => (multi ? ` (${t(hass, `fuel_type.${f}` as Key)})` : "");
    const tile = (label: string, value: string, suffix = "", main = false) =>
      html`<div class="tile ${main ? "main" : ""}">
        <dt>${label}</dt>
        <dd>${value}${suffix ? html` <small>${suffix}</small>` : nothing}</dd>
      </div>`;
    const totalVolume = Object.values(s.fuel_volume).reduce((a, b) => a + b, 0);
    const categories = Object.entries(s.expenses_by_category).sort((a, b) => b[1] - a[1]);
    type Row = { label: string; color: string; value: number };
    const rows: Row[] = [
      { label: t(hass, "category.fuel"), color: "#2e7d32", value: s.fuel_cost },
      ...categories.map(([id, value]) => {
        const c = this._categories.find((x) => x.id === id);
        return { label: c?.label ?? id, color: c?.color ?? "#757575", value };
      }),
    ].filter((row) => row.value > 0);
    const total = rows.reduce((a, r) => a + r.value, 0);
    const months = Math.max(1, s.days / 30.44);
    const co2 = co2Mass(hass, s.co2_kg);
    const co2Month = co2Mass(hass, s.co2_kg / months);
    // Évolution du prix entre le premier et le dernier plein de la période.
    const mainFuel = vehicle.fuel_types[0];
    const prices = s.prices[mainFuel] ?? [];
    const priceChange =
      prices.length > 1 && prices[0].value > 0
        ? prices[prices.length - 1].value / prices[0].value - 1
        : null;
    const signedPct = (v: number | null) =>
      v === null
        ? "—"
        : new Intl.NumberFormat(hass.locale?.language ?? hass.language, {
            style: "percent",
            maximumFractionDigits: 1,
            signDisplay: "exceptZero",
          }).format(v);
    const pct = (v: number) =>
      new Intl.NumberFormat(hass.locale?.language ?? hass.language, {
        style: "percent",
        maximumFractionDigits: 0,
      }).format(total > 0 ? v / total : 0);

    return html`<ha-card>
      <div class="head">
        <h2>${this._config.title || `${t(hass, "stats.name")} · ${vehicle.name}`}</h2>
        <div class="periods" role="group" aria-label=${t(hass, "stats.period")}>
          ${PERIODS.map(
            (p) => html`<button
              aria-pressed=${this._period === p ? "true" : "false"}
              @click=${() => this._select(p)}
            >
              ${t(hass, `stats.period_${p}` as Key)}
            </button>`,
          )}
        </div>
      </div>
      <p class="range">${shortDate(hass, s.start)} – ${shortDate(hass, s.end)}</p>
      <div class="groups">
        <section class="group" aria-labelledby="g-consumption">
          <h3 id="g-consumption">${t(hass, "stats.group_consumption")}</h3>
          <dl class="tiles">
            ${vehicle.fuel_types.map((f) => {
              const values = (s.series[f] ?? []).map((p) => p.value);
              const cu = vehicle.units.consumption[f];
              // En volume par distance (L/100 km), le meilleur plein est le plus bas.
              const perDistance = /\/100/.test(cu ?? "");
              const best = values.length ? (perDistance ? Math.min : Math.max)(...values) : null;
              const worst = values.length ? (perDistance ? Math.max : Math.min)(...values) : null;
              return html`${tile(
                `${t(hass, "stats.consumption")}${fuelName(f)}`,
                num(hass, s.consumption[f], 2),
                cu,
                true,
              )}
              ${tile(t(hass, "stats.best"), num(hass, best, 2), cu)}
              ${tile(t(hass, "stats.worst"), num(hass, worst, 2), cu)}`;
            })}
          </dl>
        </section>
        <section class="group" aria-labelledby="g-distance">
          <h3 id="g-distance">${t(hass, "stats.group_distance")}</h3>
          <dl class="tiles">
            ${tile(t(hass, "stats.distance"), num(hass, s.distance, 0), unit, true)}
            ${tile(t(hass, "stats.fills"), num(hass, s.fill_count, 0))}
            ${tile(
              t(hass, "stats.distance_per_fill"),
              num(hass, s.fill_count > 1 ? s.distance / (s.fill_count - 1) : null, 0),
              unit,
            )}
            ${vehicle.fuel_types.map((f) =>
              tile(
                `${t(hass, "stats.volume")}${fuelName(f)}`,
                num(hass, s.fuel_volume[f], 0),
                vehicle.units.volume[f],
              ),
            )}
          </dl>
        </section>
        <section class="group" aria-labelledby="g-costs">
          <h3 id="g-costs">${t(hass, "stats.group_costs")}</h3>
          <dl class="tiles">
            ${tile(t(hass, "stats.total_cost"), money(hass, s.total_cost, currency), "", true)}
            ${tile(t(hass, "stats.per_month"), money(hass, s.total_cost / months, currency))}
            ${tile(
              t(hass, "stats.cost_per_distance", { unit }),
              money(hass, s.cost_per_distance, currency, 3),
            )}
            ${!multi
              ? tile(
                  t(hass, "stats.avg_price", {
                    unit: vehicle.units.volume[vehicle.fuel_types[0]] ?? "L",
                  }),
                  money(hass, totalVolume > 0 ? s.fuel_cost / totalVolume : null, currency, 3),
                )
              : nothing}
            ${tile(
              prices.length > 1
                ? `${t(hass, "stats.price_change")} (${num(hass, prices[0].value, 3)} → ${num(hass, prices[prices.length - 1].value, 3)})`
                : t(hass, "stats.price_change"),
              signedPct(priceChange),
            )}
          </dl>
        </section>
        <section class="group" aria-labelledby="g-carbon">
          <h3 id="g-carbon">${t(hass, "stats.group_carbon")}</h3>
          <dl class="tiles">
            ${tile(t(hass, "stats.co2_total"), co2.value, co2.unit, true)}
            ${tile(
              t(hass, "stats.co2_per_distance", { unit }),
              num(hass, s.co2_per_distance, 0),
              "g CO₂e",
            )}
            ${tile(t(hass, "stats.co2_per_month"), co2Month.value, co2Month.unit)}
          </dl>
          <p class="note">${t(hass, "stats.co2_source")}</p>
        </section>
      </div>
      <div class="bottom">
      ${vehicle.fuel_types.map(
        (f) => html`<section aria-labelledby="curve-${f}">
          <h3 id="curve-${f}">
            ${t(hass, "stats.curve")}${vehicle.fuel_types.length > 1
              ? ` · ${t(hass, `fuel_type.${f}` as Key)}`
              : ""}
          </h3>
          <vl-consumption-chart
            .hass=${hass}
            .points=${s.series[f] ?? []}
            .unit=${vehicle.units.consumption[f]}
            .window=${s.moving_average_window}
          ></vl-consumption-chart>
        </section>`,
      )}
      ${vehicle.fuel_types
        .filter((f) => (s.prices[f] ?? []).length)
        .map(
          (f) => html`<section aria-labelledby="price-${f}">
            <h3 id="price-${f}">${t(hass, "stats.price_curve")}${fuelName(f)}</h3>
            <vl-price-chart
              .hass=${hass}
              .points=${s.prices[f]}
              .currency=${currency}
              .unit=${vehicle.units.volume[f] ?? "L"}
            ></vl-price-chart>
          </section>`,
        )}
      ${rows.length
        ? html`<section aria-labelledby="by-category">
            <h3 id="by-category">${t(hass, "stats.by_category")}</h3>
            <div class="stack" aria-hidden="true">
              ${rows.map(
                ({ color, value }) =>
                  html`<span style="flex:${value};background:${color}"></span>`,
              )}
            </div>
            <ul class="legend">
              ${rows.map(
                ({ label, color, value }) => html`<li>
                  <span class="dot" style="background:${color}"></span>
                  <span class="name">${label}</span>
                  <span class="pct">${pct(value)}</span>
                  <span class="amount">${money(hass, value, currency)}</span>
                </li>`,
              )}
            </ul>
          </section>`
        : nothing}
      </div>
    </ha-card>`;
  }
}
