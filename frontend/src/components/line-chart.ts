// Courbe(s) datée(s) sur un axe de temps réel (SVG, sans bibliothèque).
// Utilisée pour le coût au km cumulé et pour le compteur.
import { html, LitElement, nothing, svg } from "lit";

import { shortDate } from "../format";
import { t } from "../i18n";
import type { HomeAssistant } from "../types";
import { dateLabels, VlConsumptionChart } from "./consumption-chart";

const H = 220;
const PAD = { top: 12, right: 12, bottom: 28, left: 80 };

export interface LineSeries {
  label: string;
  color: string;
  points: { date: string; value: number }[];
}

/** Pas « rond » (1, 2, 2,5 ou 5 × 10ⁿ) proche de ``raw``. */
function niceStep(raw: number): number {
  const power = 10 ** Math.floor(Math.log10(raw));
  const unit = raw / power;
  const nice = unit <= 1 ? 1 : unit <= 2 ? 2 : unit <= 2.5 ? 2.5 : unit <= 5 ? 5 : 10;
  return nice * power;
}

/** Jour (en jours depuis 1970) d'une date ISO, pour une échelle de temps. */
function dayNumber(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return Date.UTC(y, m - 1, d) / 86_400_000;
}

export class VlLineChart extends LitElement {
  static override properties = {
    hass: { attribute: false },
    series: { attribute: false },
    format: { attribute: false },
    name: { type: String },
    zeroBased: { type: Boolean, attribute: "zero-based" },
    _width: { state: true },
  };
  // Même présentation que la courbe de consommation.
  static override styles = VlConsumptionChart.styles;

  declare hass: HomeAssistant;
  declare series: LineSeries[];
  declare format: (value: number) => string;
  declare name: string;
  declare zeroBased: boolean;
  declare _width: number;
  private _observer?: ResizeObserver;

  constructor() {
    super();
    this.series = [];
    this.format = (v) => String(v);
    this.name = "";
    this.zeroBased = false;
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
    const series = this.series.filter((s) => s.points.length);
    const dates = [...new Set(series.flatMap((s) => s.points.map((p) => p.date)))].sort();
    if (dates.length < 2) return html`<p class="empty">${t(hass, "stats.line_empty")}</p>`;
    const W = this._width;
    const values = series.flatMap((s) => s.points.map((p) => p.value));
    let lo = this.zeroBased ? 0 : Math.min(...values);
    let hi = Math.max(...values);
    const pad = Math.max((hi - lo) * 0.1, Math.abs(hi) * 0.01, 1e-6);
    if (!this.zeroBased) lo = Math.max(0, lo - pad);
    hi += pad;
    // Graduations rondes (1, 2 ou 5 × 10ⁿ) : 108 000 km plutôt que 108 017.
    const step = niceStep((hi - lo) / 3);
    lo = Math.floor(lo / step) * step;
    hi = Math.ceil(hi / step) * step;
    const ticks: number[] = [];
    for (let v = lo; v <= hi + step / 2; v += step) ticks.push(v);
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;
    const first = dayNumber(dates[0]);
    const span = Math.max(1, dayNumber(dates[dates.length - 1]) - first);
    const xDate = (iso: string) => PAD.left + ((dayNumber(iso) - first) / span) * plotW;
    const y = (v: number) => PAD.top + plotH - ((v - lo) / (hi - lo)) * plotH;
    const labels = dateLabels(hass, dates, (i) => xDate(dates[i]), plotW);
    const summary = t(hass, "stats.line_summary", {
      name: this.name,
      count: dates.length,
      start: shortDate(hass, dates[0]),
      end: shortDate(hass, dates[dates.length - 1]),
    });
    // Peu de points : on les marque pour qu'ils restent visibles.
    const marks = dates.length <= 40;
    return html`
      <svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label=${summary}>
        ${ticks.map(
          (v) => svg`<line class="grid" x1=${PAD.left} x2=${W - PAD.right} y1=${y(v)} y2=${y(v)}></line>
            <text class="axis" x=${PAD.left - 6} y=${y(v) + 4} text-anchor="end">${this.format(v)}</text>`,
        )}
        ${series.map(
          (s) => svg`<path
              d=${s.points.map((p, i) => `${i ? "L" : "M"}${xDate(p.date)},${y(p.value)}`).join(" ")}
              fill="none" stroke=${s.color} stroke-width="2" stroke-linejoin="round"></path>
            ${s.points.map(
              (p) => svg`<circle cx=${xDate(p.date)} cy=${y(p.value)} r=${marks ? 3 : 0}
                fill=${s.color} stroke="var(--card-background-color, #fff)" stroke-width="1">
                <title>${shortDate(hass, p.date)} · ${s.label} : ${this.format(p.value)}</title>
              </circle>`,
            )}`,
        )}
        ${labels.map(
          (l) => svg`<text class="axis" x=${l.x} y=${H - 8} text-anchor=${l.anchor}>${l.text}</text>`,
        )}
      </svg>
      ${series.length > 1
        ? html`<ul class="legend">
            ${series.map(
              (s) => html`<li>
                <svg width="18" height="14" aria-hidden="true" style="height:14px">
                  <line x1="1" x2="17" y1="7" y2="7" stroke=${s.color} stroke-width="3"></line>
                </svg>
                ${s.label}
              </li>`,
            )}
          </ul>`
        : nothing}
      <div class="visually-hidden">
        <table>
          <caption>${summary}</caption>
          <thead>
            <tr>
              <th scope="col">${t(hass, "fuel.date")}</th>
              ${series.map((s) => html`<th scope="col">${s.label}</th>`)}
            </tr>
          </thead>
          <tbody>
            ${dates.map(
              (d) => html`<tr>
                <th scope="row">${shortDate(hass, d)}</th>
                ${series.map((s) => {
                  const p = s.points.find((x) => x.date === d);
                  return html`<td>${p ? this.format(p.value) : "—"}</td>`;
                })}
              </tr>`,
            )}
          </tbody>
        </table>
      </div>
    `;
  }
}
