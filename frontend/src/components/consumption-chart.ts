// Courbe de consommation par plein et moyenne mobile (SVG, sans bibliothèque).
import { css, html, LitElement, nothing, svg } from "lit";

import { longMonthLabel, num, shortDate } from "../format";
import { t } from "../i18n";
import { sharedStyles } from "../styles";
import type { ConsumptionPoint, HomeAssistant } from "../types";

const H = 220;
const PAD = { top: 12, right: 12, bottom: 28, left: 44 };
const POINT_COLOR = "#1e88e5";
const AVERAGE_COLOR = "#ef6c00";

export class VlConsumptionChart extends LitElement {
  static override properties = {
    hass: { attribute: false },
    points: { attribute: false },
    unit: { type: String },
    window: { type: Number },
    _width: { state: true },
  };
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        position: relative;
      }
      svg.chart {
        width: 100%;
        height: ${H}px;
        display: block;
      }
      ul.legend svg {
        flex: none;
      }
      .axis {
        fill: var(--vl-muted);
        font-size: 12px;
      }
      .grid {
        stroke: var(--vl-border);
      }
      ul.legend {
        list-style: none;
        display: flex;
        flex-wrap: wrap;
        gap: 4px 16px;
        padding: 0;
        margin: 8px 0 0;
        font-size: 0.875rem;
      }
      ul.legend li {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
    `,
  ];

  declare hass: HomeAssistant;
  declare points: ConsumptionPoint[];
  declare unit: string;
  declare window: number;
  declare _width: number;
  private _observer?: ResizeObserver;

  constructor() {
    super();
    this.points = [];
    this.unit = "";
    this.window = 5;
    this._width = 600;
  }

  override connectedCallback(): void {
    super.connectedCallback();
    this._observer = new ResizeObserver(([entry]) => {
      const width = Math.round(entry.contentRect.width);
      if (width > 0 && Math.abs(width - this._width) > 2) this._width = width;
    });
    this._observer.observe(this);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._observer?.disconnect();
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
    // Quelques libellés de dates, sans chevauchement.
    const maxLabels = Math.max(2, Math.floor(plotW / 90));
    const step = Math.max(1, Math.ceil(pts.length / maxLabels));
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
        <path d=${line} fill="none" stroke=${AVERAGE_COLOR} stroke-width="2.5" stroke-linejoin="round"></path>
        ${pts.map(
          (p, i) => svg`<circle cx=${x(i)} cy=${y(p.value)} r="4" fill=${POINT_COLOR}
              stroke="var(--card-background-color, #fff)" stroke-width="1.5">
              <title>${shortDate(hass, p.date)} : ${num(hass, p.value, 2)} ${this.unit} (${averageLabel} : ${num(hass, p.moving_average, 2)})</title>
            </circle>`,
        )}
        ${pts.map((p, i) =>
          (i % step === 0 && pts.length - 1 - i >= step / 2) || i === pts.length - 1
            ? svg`<text class="axis" x=${x(i)} y=${H - 8}
                text-anchor=${pts.length > 1 && i === 0 ? "start" : pts.length > 1 && i === pts.length - 1 ? "end" : "middle"}
              >${longMonthLabel(hass, p.date.slice(0, 7))}</text>`
            : nothing,
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
