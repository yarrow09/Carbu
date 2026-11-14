// Styles partagés : variables du thème Home Assistant (clair / sombre).
//
// Identité visuelle : surfaces sobres, un dégradé d'accent (couleur primaire du
// thème → turquoise), puces d'icônes colorées et animations d'entrée légères,
// désactivées si le système demande moins de mouvement.
import { css } from "lit";

export const sharedStyles = css`
  :host {
    --vl-gap: 12px;
    --vl-radius: var(--ha-card-border-radius, 12px);
    --vl-radius-lg: 18px;
    --vl-accent: var(--primary-color, #03a9f4);
    --vl-accent-2: #1de9b6;
    --vl-gradient: linear-gradient(135deg, var(--vl-accent), var(--vl-accent-2));
    /* Surfaces : un voile de la couleur du texte, lisible en clair et en sombre. */
    --vl-surface: color-mix(in srgb, var(--primary-text-color) 4%, transparent);
    --vl-surface-strong: color-mix(in srgb, var(--primary-text-color) 8%, transparent);
    --vl-muted: var(--secondary-text-color);
    --vl-border: var(--divider-color, rgba(127, 127, 127, 0.3));
    /* Bordure des champs : contraste ≥ 3:1 (WCAG 1.4.11). */
    --vl-input-border: var(--secondary-text-color);
    --vl-focus: var(--primary-color);
    /* Couleurs d'état utilisées pour du texte : mélangées à la couleur du texte
       du thème pour garder un contraste AA en clair comme en sombre. */
    --vl-error-text: color-mix(
      in srgb,
      var(--error-color, #db4437) 75%,
      var(--primary-text-color)
    );
    --vl-warning-text: color-mix(
      in srgb,
      var(--warning-color, #ffa600) 55%,
      var(--primary-text-color)
    );
    color: var(--primary-text-color);
  }
  ha-card {
    border-radius: var(--vl-radius-lg);
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 9%, transparent);
    background:
      radial-gradient(
        120% 60% at 0% 0%,
        color-mix(in srgb, var(--vl-accent) 9%, transparent),
        transparent 60%
      ),
      var(--ha-card-background, var(--card-background-color, #1c1c1c));
    box-shadow: 0 18px 40px -28px rgba(0, 0, 0, 0.75);
  }
  /* Titres de section : petites capitales discrètes. */
  h3.section {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--vl-muted);
  }
  h3.section svg.mdi {
    width: 18px;
    height: 18px;
    color: var(--vl-accent);
  }
  /* Entrée en douceur, décalée par --i. */
  .rise {
    animation: vl-rise 0.45s cubic-bezier(0.2, 0.7, 0.2, 1) both;
    animation-delay: calc(var(--i, 0) * 45ms);
  }
  @keyframes vl-rise {
    from {
      opacity: 0;
      transform: translateY(8px);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .rise {
      animation: none;
    }
    * {
      transition: none !important;
    }
  }
  .visually-hidden {
    position: absolute !important;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  button {
    font: inherit;
    cursor: pointer;
    border-radius: 999px;
    min-height: 40px;
    padding: 0 16px;
    border: 1px solid var(--vl-input-border);
    background: transparent;
    color: var(--primary-text-color);
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    transition:
      transform 0.15s ease,
      background-color 0.15s ease,
      box-shadow 0.15s ease;
  }
  button:not(:disabled):not(.icon):hover {
    background: var(--vl-surface-strong);
    transform: translateY(-1px);
  }
  button:not(:disabled):active {
    transform: translateY(0) scale(0.98);
  }
  /* Bouton principal teinté : le texte garde la couleur du thème, ce qui
     assure un contraste AA quelle que soit la couleur primaire. Le liseré en
     dégradé donne l'accent. */
  button.primary,
  button[aria-pressed="true"] {
    background:
      linear-gradient(
          color-mix(in srgb, var(--vl-accent) 20%, var(--card-background-color, #1c1c1c)),
          color-mix(in srgb, var(--vl-accent) 20%, var(--card-background-color, #1c1c1c))
        )
        padding-box,
      var(--vl-gradient) border-box;
    border: 1px solid transparent;
    color: var(--primary-text-color);
    font-weight: 500;
  }
  button.primary:not(:disabled):hover,
  button[aria-pressed="true"]:not(:disabled):hover {
    box-shadow: 0 6px 18px -8px color-mix(in srgb, var(--vl-accent) 70%, transparent);
  }
  button.danger {
    color: var(--vl-error-text);
    border-color: var(--vl-error-text);
  }
  button.icon {
    min-width: 40px;
    min-height: 40px;
    padding: 0;
    border: none;
    display: inline-grid;
    place-items: center;
    color: var(--vl-muted);
  }
  button.icon:not(:disabled):hover {
    background: var(--vl-surface-strong);
    color: var(--primary-text-color);
  }
  @media (max-width: 420px) {
    button.icon {
      min-width: 36px;
    }
  }
  button:disabled {
    opacity: 0.5;
    cursor: default;
  }
  :is(button, input, select, textarea, [tabindex]):focus-visible {
    outline: 2px solid var(--vl-focus);
    outline-offset: 2px;
  }
  svg.mdi {
    width: 20px;
    height: 20px;
    fill: currentColor;
  }
  .field {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }
  .field label {
    font-size: 0.875rem;
    color: var(--vl-muted);
  }
  .field .hint {
    font-size: 0.75rem;
    color: var(--vl-muted);
  }
  input,
  select,
  textarea {
    font: inherit;
    color: var(--primary-text-color);
    background: var(--card-background-color, var(--ha-card-background, #fff));
    border: 1px solid var(--vl-input-border);
    border-radius: 8px;
    min-height: 40px;
    padding: 0 10px;
    box-sizing: border-box;
    width: 100%;
  }
  textarea {
    padding: 8px 10px;
    min-height: 64px;
    resize: vertical;
  }
  input[type="checkbox"] {
    width: 20px;
    min-height: 20px;
    height: 20px;
    accent-color: var(--primary-color);
  }
  input[readonly].computed {
    border-style: dashed;
  }
  .error {
    color: var(--vl-error-text);
  }
  .muted {
    color: var(--vl-muted);
  }
  .empty {
    color: var(--vl-muted);
    padding: 8px 0;
  }
  .badge {
    display: inline-block;
    font-size: 0.75rem;
    padding: 1px 6px;
    border-radius: 999px;
    border: 1px solid var(--vl-input-border);
    color: var(--vl-muted);
    vertical-align: middle;
  }
`;

// Listes d'entrées (journal, rappels, récurrences, export).
export const listStyles = css`
  ul.entries {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  ul.entries li {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 6px;
    border-radius: 12px;
    transition: background-color 0.15s ease;
  }
  ul.entries li + li {
    border-top: 1px solid var(--vl-border);
  }
  ul.entries li:hover {
    background: var(--vl-surface);
  }
  .entry-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
  }
  .entry-title {
    display: flex;
    gap: 8px;
    justify-content: space-between;
    align-items: baseline;
  }
  .entry-title > :first-child {
    min-width: 0;
  }
  .entry-title > .amount {
    flex: none;
  }
  .entry-sub {
    font-size: 0.875rem;
    color: var(--vl-muted);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .amount {
    font-variant-numeric: tabular-nums;
    font-weight: 500;
  }
  .row-actions {
    display: flex;
    flex: none;
  }
`;

// Icônes Material Design (@mdi/js, licence Apache 2.0), sans composant HA.
export {
  mdiBellOutline,
  mdiCalendarClock,
  mdiCashMultiple,
  mdiCashPlus,
  mdiChartBellCurveCumulative,
  mdiChartLine,
  mdiCheck,
  mdiClose,
  mdiCurrencyEur,
  mdiDelete,
  mdiDownload,
  mdiGasStation,
  mdiGasStationOutline,
  mdiLeaf,
  mdiMapMarkerDistance,
  mdiPaperclip,
  mdiPencil,
  mdiPlus,
  mdiRepeat,
  mdiSpeedometer,
  mdiUpload,
  mdiWater,
} from "@mdi/js";
