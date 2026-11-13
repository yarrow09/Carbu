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
  };
  static override styles = [
    sharedStyles,
    dialogStyles,
  ];

  declare hass: HomeAssistant;
  declare _message: string;
  private _resolve?: (value: boolean) => void;

  constructor() {
    super();
    this._message = "";
  }

  async ask(message: string): Promise<boolean> {
    this._message = message;
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
      style="height: auto"
      @cancel=${() => this._resolve?.(false)}
    >
      <div class="body">
        <p id="confirm-message">${this._message}</p>
      </div>
      <footer>
        <button type="button" @click=${() => this._answer(false)}>
          ${t(this.hass, "common.cancel")}
        </button>
        <button type="button" class="danger" @click=${() => this._answer(true)}>
          ${t(this.hass, "common.delete")}
        </button>
      </footer>
    </dialog>`;
  }
}
