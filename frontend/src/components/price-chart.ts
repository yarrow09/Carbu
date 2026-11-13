// Évolution du prix du carburant, plein par plein (SVG, sans bibliothèque).
// Chaque point prend la couleur de la qualité d'essence (SP95-E10, SP95, SP98).
import { html, LitElement, svg } from "lit";

import { gradeLabel, money, shortDate } from "../format";
import { t } from "../i18n";
import type { FuelGrade, HomeAssistant, PricePoint } from "../types";
import { dateLabels, VlConsumptionChart } from "./consumption-chart";

const H = 220;
const PAD = { top: 12, right: 12, bottom: 28, left: 52 };
const LINE_COLOR = "#78909c";
const GRADE_COLORS: Record<FuelGrade | "none", string> = {
  e10: "#43a047",
  sp95: "#1e88e5",
  sp98: "#8e24aa",
  none: "#757575",
};

export class VlPriceChart extends LitElement {
  static override properties = {
    hass: { attribute: false },
    points: { attribute: false },
    currency: { type: String },
    unit: { type: String },
    _width: { state: true },
  };
  // Même présentation que la courbe de consommation.
  static override styles = VlConsumptionChart.styles;

  declare hass: HomeAssistant;
  declare points: PricePoint[];
  declare currency: string;
  declare unit: string;
  declare _width: number;
  private _observer?: ResizeObserver;

  constructor() {
    super();
    this.points = [];
    this.currency = "EUR";
    this.unit = "L";
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
    if (!pts.length) return html`<p class="empty">${t(hass, "stats.price_empty")}</p>`;
    const W = this._width;
    const values = pts.map((p) => p.value);
    let lo = Math.min(...values);
    let hi = Math.max(...values);
    const pad = Math.max((hi - lo) * 0.15, 0.02);
    lo = Math.max(0, lo - pad);
    hi += pad;
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;
    const x = (i: number) =>
      PAD.left + (pts.length === 1 ? plotW / 2 : (i / (pts.length - 1)) * plotW);
    const y = (v: number) => PAD.top + plotH - ((v - lo) / (hi - lo)) * plotH;
    const ticks = [0, 0.5, 1].map((f) => lo + f * (hi - lo));
    const line = pts.map((p, i) => `${i ? "L" : "M"}${x(i)},${y(p.value)}`).join(" ");
    const labels = dateLabels(
      hass,
      pts.map((p) => p.date),
      x,
      plotW,
    );
    const grades = [...new Set(pts.map((p) => p.grade ?? "none"))] as (FuelGrade | "none")[];
    const gradeName = (g: FuelGrade | "none") =>
      g === "none" ? t(hass, "stats.grade_unknown") : gradeLabel(g);
    const price = (v: number) => `${money(hass, v, this.currency, 3)}/${this.unit}`;
    const summary = t(hass, "stats.price_summary", {
      count: pts.length,
      start: shortDate(hass, pts[0].date),
      end: shortDate(hass, pts[pts.length - 1].date),
    });
    return html`
      <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label=${summary}>
        ${ticks.map(
          (v) => svg`<line class="grid" x1=${PAD.left} x2=${W - PAD.right} y1=${y(v)} y2=${y(v)}></line>
            <text class="axis" x=${PAD.left - 6} y=${y(v) + 4} text-anchor="end">${money(hass, v, this.currency, 2)}</text>`,
        )}
        <path d=${line} fill="none" stroke=${LINE_COLOR} stroke-width="1.5" stroke-linejoin="round"></path>
        ${pts.map(
          (p, i) => svg`<circle cx=${x(i)} cy=${y(p.value)} r="4"
              fill=${GRADE_COLORS[p.grade ?? "none"]}
              stroke="var(--card-background-color, #fff)" stroke-width="1.5">
              <title>${shortDate(hass, p.date)} : ${price(p.value)}${p.grade ? ` (${gradeLabel(p.grade)})` : ""}</title>
            </circle>`,
        )}
        ${labels.map(
          (l) => svg`<text class="axis" x=${l.x} y=${H - 8} text-anchor=${l.anchor}>${l.text}</text>`,
        )}
      </svg>
      <ul class="legend">
        ${grades.map(
          (g) => html`<li>
            <svg width="14" height="14" aria-hidden="true" style="height:14px">
              <circle cx="7" cy="7" r="5" fill=${GRADE_COLORS[g]}></circle>
            </svg>
            ${gradeName(g)}
          </li>`,
        )}
      </ul>
      <div class="visually-hidden">
        <table>
          <caption>${summary}</caption>
          <thead>
            <tr>
              <th scope="col">${t(hass, "fuel.date")}</th>
              <th scope="col">${t(hass, "stats.price_point")}</th>
              <th scope="col">${t(hass, "fuel.grade")}</th>
            </tr>
          </thead>
          <tbody>
            ${pts.map(
              (p) => html`<tr>
                <th scope="row">${shortDate(hass, p.date)}</th>
                <td>${price(p.value)}</td>
                <td>${p.grade ? gradeLabel(p.grade) : "—"}</td>
              </tr>`,
            )}
          </tbody>
        </table>
      </div>
    `;
  }
}
