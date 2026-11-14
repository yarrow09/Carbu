// Export CSV d'un véhicule : téléchargement direct depuis le navigateur.
import { css, html, LitElement, nothing } from "lit";

import { fetchExport } from "../api";
import { num, todayIso } from "../format";
import { t, type Key } from "../i18n";
import { mdiClose, mdiDownload, listStyles, sharedStyles } from "../styles";
import type { HomeAssistant, VehicleView } from "../types";
import { dialogStyles } from "./dialog-styles";
import { icon } from "./icon";

// Ordre d'affichage des fichiers.
const ORDER = ["pleins", "depenses", "depenses_recurrentes", "releves", "rappels"];

/** Nom de fichier sûr : lettres, chiffres et tirets. */
function slug(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^A-Za-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .toLowerCase() || "vehicule"
  );
}

function download(name: string, content: string): void {
  // BOM UTF-8 : les accents s'affichent correctement dans Excel.
  const blob = new Blob(["﻿", content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = name;
  document.body.append(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export class VlExportDialog extends LitElement {
  static override properties = {
    hass: { attribute: false },
    vehicle: { attribute: false },
    _files: { state: true },
    _rows: { state: true },
    _error: { state: true },
  };
  static override styles = [
    sharedStyles,
    dialogStyles,
    listStyles,
    css`
      .main {
        flex: 1;
        display: flex;
        flex-direction: column;
      }
      .sub {
        font-size: 0.875rem;
        color: var(--vl-muted);
      }
    `,
  ];

  declare hass: HomeAssistant;
  declare vehicle: VehicleView;
  declare _files: Record<string, string> | null;
  declare _rows: Record<string, number>;
  declare _error: string;

  constructor() {
    super();
    this._files = null;
    this._rows = {};
    this._error = "";
  }

  private get _dialog(): HTMLDialogElement {
    return this.renderRoot.querySelector("dialog") as HTMLDialogElement;
  }

  async open(): Promise<void> {
    this._files = null;
    this._error = "";
    await this.updateComplete;
    this._dialog.showModal();
    try {
      const result = await fetchExport(this.hass, this.vehicle.id);
      this._rows = result.rows;
      this._files = result.files;
    } catch (err) {
      this._error = t(this.hass, "common.error", { message: (err as Error).message });
    }
  }

  close(): void {
    this._dialog?.close();
  }

  private _fileName(file: string): string {
    return `carbu-${slug(this.vehicle.name)}-${file.replace(/\.csv$/, "")}-${todayIso()}.csv`;
  }

  private _names(): string[] {
    const files = this._files ?? {};
    return Object.keys(files).sort(
      (a, b) => ORDER.indexOf(a.replace(/\.csv$/, "")) - ORDER.indexOf(b.replace(/\.csv$/, "")),
    );
  }

  private _all(): void {
    const files = this._files ?? {};
    // Fichiers vides ignorés ; un léger délai évite que le navigateur bloque
    // les téléchargements successifs.
    const names = this._names().filter((name) => (this._rows[name] ?? 0) > 0);
    names.forEach((name, i) =>
      setTimeout(() => download(this._fileName(name), files[name]), i * 300),
    );
  }

  protected override render() {
    if (!this.vehicle) return nothing;
    const hass = this.hass;
    const files = this._files;
    return html`<dialog aria-labelledby="export-title">
      <header>
        <h2 id="export-title">${t(hass, "export.title")} · ${this.vehicle.name}</h2>
        <button
          type="button"
          class="icon"
          aria-label=${t(hass, "common.close")}
          @click=${() => this.close()}
        >
          ${icon(mdiClose)}
        </button>
      </header>
      <div class="body">
        <p class="help">${t(hass, "export.help")}</p>
        ${this._error ? html`<p class="error" role="alert">${this._error}</p>` : nothing}
        ${files
          ? html`<ul class="entries">
              ${this._names().map((name) => {
                const key = name.replace(/\.csv$/, "");
                const rows = this._rows[name] ?? 0;
                const label = t(hass, `export.file_${key}` as Key);
                return html`<li>
                  <div class="main">
                    <span>${label}</span>
                    <span class="sub">${t(hass, "export.lines", { count: num(hass, rows, 0) })}</span>
                  </div>
                  <button
                    ?disabled=${rows === 0}
                    aria-label="${t(hass, "export.download")} : ${label}"
                    @click=${() => download(this._fileName(name), files[name])}
                  >
                    ${icon(mdiDownload)} ${t(hass, "export.download")}
                  </button>
                </li>`;
              })}
            </ul>`
          : this._error
            ? nothing
            : html`<p>${t(hass, "common.loading")}</p>`}
      </div>
      <footer>
        <button type="button" @click=${() => this.close()}>${t(hass, "common.close")}</button>
        <button type="button" class="primary" ?disabled=${!files} @click=${() => this._all()}>
          ${icon(mdiDownload)} ${t(hass, "export.download_all")}
        </button>
      </footer>
    </dialog>`;
  }
}
