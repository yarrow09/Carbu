import { html } from "lit";

/** Icône SVG décorative (le libellé est porté par le bouton). */
export const icon = (path: string) =>
  html`<svg class="mdi" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path d=${path}></path>
  </svg>`;
