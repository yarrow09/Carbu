// Confirmation accessible (remplace window.confirm).
import { html, LitElement } from "lit";

import { t } from "../i18n";
import { sharedStyles } from "../styles";
import type { HomeAssistant } from "../types";
import { dialogStyles } from "./dialog-styles";

export class VlConfirmDialog extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _message: { state: true },
    _confirmLabel: { state: true },
    _danger: { state: true },
  };
  static override styles = [
    sharedStyles,
    dialogStyles,
  ];

  declare hass: HomeAssistant;
  declare _message: string;
  declare _confirmLabel: string;
  declare _danger: boolean;
  private _resolve?: (value: boolean) => void;

  constructor() {
    super();
    this._message = "";
    this._confirmLabel = "";
    this._danger = true;
  }

  /** Demander confirmation (bouton « Supprimer » par défaut). */
  async ask(message: string, confirmLabel?: string, danger = true): Promise<boolean> {
    this._message = message;
    this._confirmLabel = confirmLabel ?? "";
    this._danger = danger;
    await this.updateComplete;
    const dialog = this.renderRoot.querySelector("dialog") as HTMLDialogElement;
    dialog.showModal();
    return new Promise((resolve) => {
      this._resolve = resolve;
    });
  }

  private _answer(value: boolean): void {
    (this.renderRoot.querySelector("dialog") as HTMLDialogElement).close();
    this._resolve?.(value);
    this._resolve = undefined;
  }

  protected override render() {
    return html`<dialog
      role="alertdialog"
      aria-describedby="confirm-message"
      class="compact"
      @cancel=${() => this._resolve?.(false)}
    >
      <div class="body">
        <p id="confirm-message">${this._message}</p>
      </div>
      <footer>
        <button type="button" @click=${() => this._answer(false)}>
          ${t(this.hass, "common.cancel")}
        </button>
        <button
          type="button"
          class=${this._danger ? "danger" : "primary"}
          @click=${() => this._answer(true)}
        >
          ${this._confirmLabel || t(this.hass, "common.delete")}
        </button>
      </footer>
    </dialog>`;
  }
}
