// Base commune des graphiques SVG : largeur réelle suivie, styles partagés.
//
// Le dessin se fait à la taille réelle de l'élément (viewBox = largeur en px) :
// le texte des axes garde sa taille quelle que soit la largeur de la carte.
import { css, LitElement } from "lit";

import { sharedStyles } from "../styles";
import type { HomeAssistant } from "../types";

export const CHART_HEIGHT = 220;

export const chartStyles = [
  sharedStyles,
  css`
    :host {
      display: block;
      position: relative;
    }
    svg.chart {
      width: 100%;
      height: ${CHART_HEIGHT}px;
      display: block;
      overflow: visible;
    }
    .axis {
      fill: var(--vl-muted);
      font-size: 12px;
    }
    .grid {
      stroke: var(--vl-border);
      stroke-dasharray: 2 4;
    }
    .plot {
      animation: vl-draw 0.6s ease-out both;
    }
    @keyframes vl-draw {
      from {
        opacity: 0;
        transform: translateY(6px);
      }
    }
    @media (prefers-reduced-motion: reduce) {
      .plot {
        animation: none;
      }
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
    ul.legend svg {
      flex: none;
    }
  `,
];

export abstract class ResponsiveChart extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _width: { state: true },
  };
  static override styles = chartStyles;

  declare hass: HomeAssistant;
  declare _width: number;
  private _observer?: ResizeObserver;

  constructor() {
    super();
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
}

/** Identifiant unique pour les dégradés SVG (plusieurs graphiques par page). */
let gradientCounter = 0;
export const nextGradientId = (): string => `vl-grad-${++gradientCounter}`;
