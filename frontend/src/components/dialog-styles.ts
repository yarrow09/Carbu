import { css } from "lit";

/** Boîte de dialogue native, plein écran sur mobile. */
export const dialogStyles = css`
  dialog {
    border: 1px solid color-mix(in srgb, var(--primary-text-color) 10%, transparent);
    border-radius: 20px;
    padding: 0;
    width: min(560px, calc(100vw - 32px));
    max-height: calc(100dvh - 32px);
    background:
      radial-gradient(
        100% 40% at 0% 0%,
        color-mix(in srgb, var(--vl-accent) 10%, transparent),
        transparent 70%
      ),
      var(--card-background-color, var(--ha-card-background, #fff));
    color: var(--primary-text-color);
    box-shadow: 0 24px 60px -20px rgba(0, 0, 0, 0.7);
  }
  dialog[open] {
    animation: vl-pop 0.22s cubic-bezier(0.2, 0.8, 0.2, 1);
  }
  @keyframes vl-pop {
    from {
      opacity: 0;
      transform: translateY(12px) scale(0.98);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    dialog[open] {
      animation: none;
    }
  }
  dialog::backdrop {
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(4px);
  }
  dialog.compact {
    height: fit-content;
    width: min(420px, calc(100vw - 32px));
  }
  @media (max-width: 600px) {
    dialog:not(.compact) {
      width: 100vw;
      max-width: 100vw;
      height: 100dvh;
      max-height: 100dvh;
      border-radius: 0;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    max-height: inherit;
    height: 100%;
  }
  header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 8px 0 16px;
  }
  header h2 {
    font-size: 1.25rem;
    font-weight: 500;
    margin: 0;
  }
  .body {
    padding: 8px 16px 16px;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: var(--vl-gap);
  }
  .grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: var(--vl-gap);
  }
  .help {
    margin: 0;
    font-size: 0.875rem;
    color: var(--vl-muted);
  }
  .check {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 40px;
  }
  details summary {
    cursor: pointer;
    min-height: 40px;
    display: flex;
    align-items: center;
    color: var(--primary-text-color);
    text-decoration: underline;
    text-underline-offset: 3px;
  }
  details[open] summary {
    margin-bottom: var(--vl-gap);
  }
  .warnings {
    border: 1px solid var(--warning-color, #ffa600);
    border-radius: 8px;
    padding: 8px 12px;
  }
  .warnings ul {
    margin: 4px 0 0;
    padding-left: 20px;
  }
  footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 16px 16px;
    border-top: 1px solid var(--vl-border);
    margin-top: auto;
  }
`;
