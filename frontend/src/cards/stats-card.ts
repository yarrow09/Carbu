// Carte statistiques : période au choix, indicateurs, courbe de consommation.
import { css, html, nothing } from "lit";

import { fetchCategories, fetchStats } from "../api";
import { money, num, shortDate } from "../format";
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
      ul.bars {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 6px;
      }
      ul.bars li {
        display: grid;
        grid-template-columns: minmax(90px, 30%) 1fr auto;
        align-items: center;
        gap: 8px;
        font-size: 0.875rem;
      }
      .bar {
        height: 10px;
        border-radius: 5px;
        min-width: 2px;
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
    const fuel = vehicle.fuel_types[0];
    const unit = vehicle.units.distance;
    const currency = this._currency;
    const tile = (label: string, value: string, suffix = "") =>
      html`<div class="tile">
        <dt>${label}</dt>
        <dd>${value}${suffix ? html` <small>${suffix}</small>` : nothing}</dd>
      </div>`;
    const categories = Object.entries(s.expenses_by_category).sort((a, b) => b[1] - a[1]);
    const maxCategory = Math.max(1, ...categories.map(([, v]) => v), s.fuel_cost);
    type Row = { label: string; color: string; value: number };
    const rows: Row[] = [
      { label: t(hass, "category.fuel"), color: "#2e7d32", value: s.fuel_cost },
      ...categories.map(([id, value]) => {
        const c = this._categories.find((x) => x.id === id);
        return { label: c?.label ?? id, color: c?.color ?? "#757575", value };
      }),
    ].filter((row) => row.value > 0);

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
      <dl class="tiles">
        ${tile(t(hass, "stats.distance"), num(hass, s.distance, 0), unit)}
        ${vehicle.fuel_types.map((f) =>
          tile(
            `${t(hass, "stats.consumption")}${vehicle.fuel_types.length > 1 ? ` (${t(hass, `fuel_type.${f}` as Key)})` : ""}`,
            num(hass, s.consumption[f], 2),
            vehicle.units.consumption[f],
          ),
        )}
        ${tile(t(hass, "stats.fuel_cost"), money(hass, s.fuel_cost, currency))}
        ${tile(t(hass, "stats.expense_cost"), money(hass, s.expense_cost, currency))}
        ${tile(t(hass, "stats.total_cost"), money(hass, s.total_cost, currency))}
        ${tile(
          t(hass, "stats.cost_per_distance", { unit }),
          money(hass, s.cost_per_distance, currency, 3),
        )}
        ${tile(t(hass, "stats.fills"), num(hass, s.fill_count, 0))}
        ${tile(
          t(hass, "stats.volume"),
          num(hass, s.fuel_volume[fuel], 1),
          vehicle.units.volume[fuel],
        )}
      </dl>
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
      ${rows.length
        ? html`<section aria-labelledby="by-category">
            <h3 id="by-category">${t(hass, "stats.by_category")}</h3>
            <ul class="bars">
              ${rows.map(
                ({ label, color, value }) => html`<li>
                  <span>${label}</span>
                  <span
                    class="bar"
                    style="width:${(value / maxCategory) * 100}%;background:${color}"
                    aria-hidden="true"
                  ></span>
                  <span class="amount">${money(hass, value, currency)}</span>
                </li>`,
              )}
            </ul>
          </section>`
        : nothing}
    </ha-card>`;
  }
}
