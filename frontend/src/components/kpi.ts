// Tuiles d'indicateurs : puce d'icône colorée, valeur, libellé.
// Partagées par la carte principale et la carte statistiques.
import { css, html, nothing, type TemplateResult } from "lit";

import { icon } from "./icon";

export interface KpiOptions {
  /** Chemin d'icône MDI. */
  icon?: string;
  /** Couleur de la puce (hex). */
  color?: string;
  /** Tuile mise en avant (pleine largeur du groupe, valeur plus grande). */
  main?: boolean;
  /** Rang pour l'animation d'entrée décalée. */
  index?: number;
}

export const kpiStyles = css`
  dl.kpis {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 10px;
    margin: 0;
  }
  .kpi {
    --c: var(--group-color, var(--vl-accent));
    position: relative;
    display: grid;
    grid-template-columns: auto 1fr;
    grid-template-areas:
      "chip value"
      "chip label";
    align-items: center;
    column-gap: 10px;
    padding: 10px 12px;
    margin: 0;
    border-radius: 14px;
    background: var(--vl-surface);
    border: 1px solid transparent;
    transition:
      transform 0.18s ease,
      border-color 0.18s ease,
      background-color 0.18s ease;
  }
  .kpi:hover {
    transform: translateY(-2px);
    border-color: color-mix(in srgb, var(--c) 45%, transparent);
    background: color-mix(in srgb, var(--c) 7%, transparent);
  }
  .kpi.no-chip {
    grid-template-columns: 1fr;
    grid-template-areas:
      "value"
      "label";
  }
  .chip {
    grid-area: chip;
    width: 36px;
    height: 36px;
    border-radius: 11px;
    display: grid;
    place-items: center;
    color: var(--c);
    background: color-mix(in srgb, var(--c) 18%, transparent);
  }
  /* La puce est dans le <dt> (HTML valide) ; display: contents en fait un
     élément de la grille. */
  .kpi dt {
    display: contents;
  }
  .kpi .label {
    grid-area: label;
    font-size: 0.8125rem;
    color: var(--vl-muted);
    min-width: 0;
  }
  .kpi dd {
    grid-area: value;
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.25;
    font-variant-numeric: tabular-nums;
    min-width: 0;
    overflow-wrap: anywhere;
  }
  .kpi dd small {
    font-size: 0.8125rem;
    font-weight: 400;
    color: var(--vl-muted);
  }
  .kpi.main {
    grid-column: 1 / -1;
    background:
      linear-gradient(
        135deg,
        color-mix(in srgb, var(--c) 16%, transparent),
        color-mix(in srgb, var(--c) 4%, transparent)
      );
  }
  .kpi.main dd {
    font-size: 1.6rem;
  }
`;

/** Une tuile ``<div class="kpi">`` à placer dans un ``<dl class="kpis">``. */
export function kpi(
  label: string,
  value: string,
  unit = "",
  options: KpiOptions = {},
): TemplateResult {
  const style = [
    options.color ? `--c:${options.color}` : "",
    options.index !== undefined ? `--i:${options.index}` : "",
  ]
    .filter(Boolean)
    .join(";");
  const classes = ["kpi", "rise", options.main ? "main" : "", options.icon ? "" : "no-chip"]
    .filter(Boolean)
    .join(" ");
  return html`<div class=${classes} style=${style}>
    <dt>
      ${options.icon
        ? html`<span class="chip" aria-hidden="true">${icon(options.icon)}</span>`
        : nothing}<span class="label">${label}</span>
    </dt>
    <dd>${value}${unit ? html` <small>${unit}</small>` : nothing}</dd>
  </div>`;
}
