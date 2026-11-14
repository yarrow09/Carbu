// Histogramme empilé des dépenses mensuelles par catégorie (SVG, sans bibliothèque).
import { css, html, nothing, svg } from "lit";

import { longMonthLabel, money, monthLabel } from "../format";
import { t } from "../i18n";
import type { Category, MonthlyBucket } from "../types";
import { CHART_HEIGHT as H, chartStyles, ResponsiveChart } from "./chart-base";

// Vert foncé : contraste ≥ 3:1 sur fond clair et sombre, distinct des catégories.
const FUEL_COLOR = "#2e7d32";
const FALLBACK_COLORS = ["#1e88e5", "#8e24aa", "#00897b", "#f4511e", "#3949ab", "#e53935"];
const PAD = { top: 12, right: 8, bottom: 28, left: 56 };

interface Series {
  id: string;
  label: string;
  color: string;
}

function niceMax(value: number): number {
  if (value <= 0) return 1;
  const exp = 10 ** Math.floor(Math.log10(value));
  const step = [1, 2, 2.5, 5, 10].find((s) => s * exp >= value) ?? 10;
  return step * exp;
}

export class VlMonthlyChart extends ResponsiveChart {
  static override properties = {
    ...ResponsiveChart.properties,
    data: { attribute: false },
    categories: { attribute: false },
    currency: { type: String },
  };
  static override styles = [
    ...chartStyles,
    css`
      g.bar:hover rect.hit {
        fill: var(--primary-color);
        fill-opacity: 0.08;
      }
      .swatch {
        width: 12px;
        height: 12px;
        border-radius: 3px;
        display: inline-block;
        flex: none;
      }
    `,
  ];

  declare data: MonthlyBucket[];
  declare categories: Category[];
  declare currency: string;

  constructor() {
    super();
    this.data = [];
    this.categories = [];
    this.currency = "EUR";
  }

  private _series(): Series[] {
    const used = new Set(this.data.flatMap((b) => Object.keys(b.values)));
    const series: Series[] = [];
    if (used.has("fuel")) {
      series.push({ id: "fuel", label: t(this.hass, "category.fuel"), color: FUEL_COLOR });
    }
    let i = 0;
    for (const cat of this.categories) {
      if (!used.has(cat.id)) continue;
      series.push({
        id: cat.id,
        label: cat.label,
        color: cat.color ?? FALLBACK_COLORS[i++ % FALLBACK_COLORS.length],
      });
    }
    // Catégories supprimées entre-temps : regroupées sous leur identifiant.
    for (const id of used) {
      if (!series.some((s) => s.id === id)) {
        series.push({ id, label: id, color: FALLBACK_COLORS[i++ % FALLBACK_COLORS.length] });
      }
    }
    return series;
  }

  protected override render() {
    const hass = this.hass;
    const series = this._series();
    const totals = this.data.map((b) =>
      Object.values(b.values).reduce((sum, v) => sum + v, 0),
    );
    const max = niceMax(Math.max(0, ...totals));
    if (!totals.some((v) => v > 0)) {
      return html`<p class="empty">${t(hass, "chart.empty")}</p>`;
    }
    const W = this._width;
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;
    const slot = plotW / this.data.length;
    const barW = Math.min(36, slot * 0.7);
    // Sur petit écran, un libellé de mois sur deux.
    const labelEvery = slot < 34 ? 2 : 1;
    const y = (v: number) => PAD.top + plotH - (v / max) * plotH;
    const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);
    const fmt = (v: number) => money(hass, v, this.currency);
    const fmtAxis = (v: number) => money(hass, v, this.currency, 0);
    const summary = t(hass, "chart.summary", { count: this.data.length });

    return html`
      <svg
        class="chart"
        viewBox="0 0 ${W} ${H}"
        height=${H}
        role="img"
        aria-label=${summary}
      >
        ${ticks.map(
          (v) => svg`
            <line class="grid" x1=${PAD.left} x2=${W - PAD.right} y1=${y(v)} y2=${y(v)}></line>
            <text class="axis" x=${PAD.left - 6} y=${y(v) + 4} text-anchor="end">${fmtAxis(v)}</text>`,
        )}
        ${this.data.map((bucket, i) => {
          const x = PAD.left + i * slot + (slot - barW) / 2;
          let acc = 0;
          const detail = [
            `${longMonthLabel(hass, bucket.month)} — ${t(hass, "chart.total")} ${fmt(totals[i])}`,
            ...series
              .filter((s) => bucket.values[s.id])
              .map((s) => `${s.label} : ${fmt(bucket.values[s.id])}`),
          ].join("\n");
          return svg`<g class="bar">
            <title>${detail}</title>
            <rect class="hit" x=${PAD.left + i * slot} y=${PAD.top} width=${slot} height=${plotH} fill="transparent"></rect>
            ${series.map((s) => {
              const value = bucket.values[s.id] ?? 0;
              if (value <= 0) return nothing;
              const top = y(acc + value);
              const height = y(acc) - top;
              acc += value;
              return svg`<rect x=${x} y=${top} width=${barW} height=${Math.max(height, 0.5)}
                fill=${s.color} stroke="var(--card-background-color, #fff)" stroke-width="1"></rect>`;
            })}
            ${(this.data.length - 1 - i) % labelEvery === 0
              ? svg`<text class="axis" x=${x + barW / 2} y=${H - 8} text-anchor="middle">${monthLabel(hass, bucket.month)}</text>`
              : nothing}
          </g>`;
        })}
      </svg>
      <ul class="legend" aria-label=${t(hass, "section.monthly")}>
        ${series.map(
          (s) => html`<li>
            <span class="swatch" style="background:${s.color}" aria-hidden="true"></span>${s.label}
          </li>`,
        )}
      </ul>
      <div class="visually-hidden"><table>
        <caption>${summary}</caption>
        <thead>
          <tr>
            <th scope="col">${t(hass, "chart.month")}</th>
            ${series.map((s) => html`<th scope="col">${s.label}</th>`)}
            <th scope="col">${t(hass, "chart.total")}</th>
          </tr>
        </thead>
        <tbody>
          ${this.data.map(
            (bucket, i) => html`<tr>
              <th scope="row">${longMonthLabel(hass, bucket.month)}</th>
              ${series.map((s) => html`<td>${fmt(bucket.values[s.id] ?? 0)}</td>`)}
              <td>${fmt(totals[i])}</td>
            </tr>`,
          )}
        </tbody>
      </table></div>
    `;
  }
}
