// Courbe de consommation par plein et moyenne mobile (SVG, sans bibliothèque).
import { html, svg } from "lit";

import { longMonthLabel, num, shortDate } from "../format";
import { t } from "../i18n";
import type { ConsumptionPoint, HomeAssistant } from "../types";
import { CHART_HEIGHT as H, chartStyles, ResponsiveChart } from "./chart-base";

const PAD = { top: 12, right: 12, bottom: 28, left: 44 };
const POINT_COLOR = "#1e88e5";
const AVERAGE_COLOR = "#ef6c00";

export interface DateLabel {
  x: number;
  text: string;
  anchor: "start" | "middle" | "end";
}

/**
 * Libellés de dates d'un axe horizontal, sans chevauchement : le premier et le
 * dernier point sont toujours datés, les intermédiaires s'il reste de la place.
 */
export function dateLabels(
  hass: HomeAssistant,
  dates: string[],
  x: (i: number) => number,
  plotW: number,
): DateLabel[] {
  const charWidth = 6.5; // police des axes : 11 px
  const gap = 12;
  const n = dates.length;
  const make = (i: number) => {
    const text = longMonthLabel(hass, dates[i].slice(0, 7));
    const anchor: DateLabel["anchor"] =
      n === 1 ? "middle" : i === 0 ? "start" : i === n - 1 ? "end" : "middle";
    const w = text.length * charWidth;
    const left = anchor === "start" ? x(i) : anchor === "end" ? x(i) - w : x(i) - w / 2;
    return { x: x(i), text, anchor, left, right: left + w };
  };
  if (n === 0) return [];
  if (n === 1) return [make(0)];
  const last = make(n - 1);
  const kept = [make(0)];
  const maxLabels = Math.max(2, Math.floor(plotW / 90));
  const step = Math.max(1, Math.ceil(n / maxLabels));
  for (let i = step; i < n - 1; i += step) {
    const label = make(i);
    if (label.left >= kept[kept.length - 1].right + gap && label.right + gap <= last.left) {
      kept.push(label);
    }
  }
  if (last.left >= kept[kept.length - 1].right + gap || kept.length === 1) kept.push(last);
  else kept[kept.length - 1] = last;
  return kept;
}

export class VlConsumptionChart extends ResponsiveChart {
  static override properties = {
    ...ResponsiveChart.properties,
    points: { attribute: false },
    unit: { type: String },
    window: { type: Number },
  };
  static override styles = chartStyles;

  declare points: ConsumptionPoint[];
  declare unit: string;
  declare window: number;

  constructor() {
    super();
    this.points = [];
    this.unit = "";
    this.window = 5;
  }

  protected override render() {
    const hass = this.hass;
    const pts = this.points;
    if (!pts.length) return html`<p class="empty">${t(hass, "stats.curve_empty")}</p>`;
    const W = this._width;
    const values = pts.flatMap((p) => [p.value, p.moving_average]);
    let lo = Math.min(...values);
    let hi = Math.max(...values);
    const pad = Math.max((hi - lo) * 0.15, 0.5);
    lo = Math.max(0, lo - pad);
    hi += pad;
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;
    const x = (i: number) =>
      PAD.left + (pts.length === 1 ? plotW / 2 : (i / (pts.length - 1)) * plotW);
    const y = (v: number) => PAD.top + plotH - ((v - lo) / (hi - lo)) * plotH;
    const ticks = [0, 0.5, 1].map((f) => lo + f * (hi - lo));
    const line = pts.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.moving_average)}`).join(" ");
    const labels = dateLabels(hass, pts.map((p) => p.date), x, plotW);
    const averageLabel = t(hass, "stats.moving_average", { count: this.window });
    const summary = t(hass, "stats.curve_summary", {
      count: pts.length,
      start: shortDate(hass, pts[0].date),
      end: shortDate(hass, pts[pts.length - 1].date),
    });
    return html`
      <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label=${summary}>
        ${ticks.map(
          (v) => svg`<line class="grid" x1=${PAD.left} x2=${W - PAD.right} y1=${y(v)} y2=${y(v)}></line>
            <text class="axis" x=${PAD.left - 6} y=${y(v) + 4} text-anchor="end">${num(hass, v, 1)}</text>`,
        )}
        <g class="plot">
        <path d=${line} fill="none" stroke=${AVERAGE_COLOR} stroke-width="2.5"
          stroke-linejoin="round" stroke-linecap="round"></path>
        ${pts.map(
          (p, i) => svg`<circle cx=${x(i)} cy=${y(p.value)} r="4" fill=${POINT_COLOR}
              stroke="var(--card-background-color, #fff)" stroke-width="1.5">
              <title>${shortDate(hass, p.date)} : ${num(hass, p.value, 2)} ${this.unit} (${averageLabel} : ${num(hass, p.moving_average, 2)})</title>
            </circle>`,
        )}
        </g>
        ${labels.map(
          (l) => svg`<text class="axis" x=${l.x} y=${H - 8} text-anchor=${l.anchor}>${l.text}</text>`,
        )}
      </svg>
      <ul class="legend">
        <li>
          <svg width="14" height="14" aria-hidden="true" style="height:14px">
            <circle cx="7" cy="7" r="5" fill=${POINT_COLOR}></circle>
          </svg>
          ${t(hass, "stats.curve_point")} (${this.unit})
        </li>
        <li>
          <svg width="20" height="14" aria-hidden="true" style="height:14px">
            <line x1="1" x2="19" y1="7" y2="7" stroke=${AVERAGE_COLOR} stroke-width="3"></line>
          </svg>
          ${averageLabel}
        </li>
      </ul>
      <div class="visually-hidden">
        <table>
          <caption>${summary}</caption>
          <thead>
            <tr>
              <th scope="col">${t(hass, "fuel.date")}</th>
              <th scope="col">${t(hass, "stats.curve_point")} (${this.unit})</th>
              <th scope="col">${averageLabel}</th>
            </tr>
          </thead>
          <tbody>
            ${pts.map(
              (p) => html`<tr>
                <th scope="row">${shortDate(hass, p.date)}</th>
                <td>${num(hass, p.value, 2)}</td>
                <td>${num(hass, p.moving_average, 2)}</td>
              </tr>`,
            )}
          </tbody>
        </table>
      </div>
    `;
  }
}
