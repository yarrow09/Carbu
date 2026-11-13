// Import CSV : choix du fichier, aperçu ligne par ligne, puis confirmation.
import { css, html, LitElement, nothing } from "lit";

import { importCsv } from "../api";
import { money, num, shortDate } from "../format";
import { t, type Key } from "../i18n";
import { mdiClose, sharedStyles } from "../styles";
import type {
  Category,
  HomeAssistant,
  ImportPreview,
  ImportResult,
  ImportStatus,
  VehicleView,
} from "../types";
import { dialogStyles } from "./dialog-styles";
import { icon } from "./icon";

export class VlImportDialog extends LitElement {
  static override properties = {
    hass: { attribute: false },
    vehicle: { attribute: false },
    categories: { attribute: false },
    currency: { type: String },
    _preview: { state: true },
    _message: { state: true },
    _error: { state: true },
    _busy: { state: true },
  };
  static override styles = [
    sharedStyles,
    dialogStyles,
    css`
      ul.lines {
        list-style: none;
        margin: 0;
        padding: 0;
        max-height: 40vh;
        overflow-y: auto;
        border: 1px solid var(--vl-border);
        border-radius: 8px;
      }
      ul.lines li {
        display: flex;
        gap: 8px;
        align-items: baseline;
        padding: 6px 10px;
        border-bottom: 1px solid var(--vl-border);
        font-size: 0.875rem;
      }
      ul.lines li:last-child {
        border-bottom: none;
      }
      .status {
        flex: none;
        font-size: 0.75rem;
        font-weight: 500;
        padding: 1px 8px;
        border-radius: 999px;
        border: 1px solid currentColor;
      }
      .status.error {
        color: var(--vl-error-text);
      }
      .status.duplicate {
        color: var(--vl-muted);
      }
      .detail {
        min-width: 0;
      }
      .line-number {
        color: var(--vl-muted);
      }
    `,
  ];

  declare hass: HomeAssistant;
  declare vehicle: VehicleView;
  declare categories: Category[];
  declare currency: string;
  declare _preview: ImportPreview | null;
  declare _message: string;
  declare _error: string;
  declare _busy: boolean;
  private _file: File | null = null;

  constructor() {
    super();
    this.categories = [];
    this.currency = "EUR";
    this._preview = null;
    this._message = "";
    this._error = "";
    this._busy = false;
  }

  private get _dialog(): HTMLDialogElement {
    return this.renderRoot.querySelector("dialog") as HTMLDialogElement;
  }

  async open(): Promise<void> {
    this._preview = null;
    this._message = "";
    this._error = "";
    this._file = null;
    await this.updateComplete;
    const input = this.renderRoot.querySelector<HTMLInputElement>("#file");
    if (input) input.value = "";
    this._dialog.showModal();
    input?.focus();
  }

  close(): void {
    this._dialog?.close();
  }

  private _errorText(code: string): string {
    const known = ["unknown_format", "empty", "too_large", "too_many_rows"];
    return known.includes(code)
      ? t(this.hass, `import.error_${code}` as Key)
      : t(this.hass, "common.error", { message: code });
  }

  private async _analyse(file: File | null): Promise<void> {
    this._file = file;
    this._preview = null;
    this._message = "";
    this._error = "";
    if (!file) return;
    this._busy = true;
    try {
      this._preview = (await importCsv(this.hass, this.vehicle.id, file, false)) as ImportPreview;
    } catch (err) {
      this._error = this._errorText((err as Error).message);
    } finally {
      this._busy = false;
    }
  }

  private async _apply(): Promise<void> {
    if (!this._file) return;
    this._busy = true;
    try {
      const result = (await importCsv(this.hass, this.vehicle.id, this._file, true)) as ImportResult;
      this._message = t(this.hass, "import.done", { count: result.added });
      this._preview = null;
      this.dispatchEvent(new CustomEvent("saved", { bubbles: true, composed: true }));
    } catch (err) {
      this._error = this._errorText((err as Error).message);
    } finally {
      this._busy = false;
    }
  }

  /** Résumé lisible d'une ligne, dans les unités du véhicule. */
  private _describe(kind: string, v: Record<string, unknown>): string {
    const hass = this.hass;
    const unit = this.vehicle.units.distance;
    const date = typeof v.date === "string" ? shortDate(hass, v.date) : "";
    if (kind === "fuel") {
      const fuel = String(v.fuel_type ?? this.vehicle.fuel_types[0]);
      const volumeUnit = this.vehicle.units.volume[fuel] ?? "L";
      return `${date} · ${num(hass, v.odometer as number, 0)} ${unit} · ${num(hass, v.volume as number, 2)} ${volumeUnit} · ${money(hass, v.total_cost as number, this.currency)}`;
    }
    if (kind === "expenses") {
      const category = this.categories.find((c) => c.id === v.category_id);
      const label = category?.label ?? "";
      return `${date} · ${money(hass, v.amount as number, this.currency)}${label ? ` · ${label}` : ""}${v.description ? ` · ${String(v.description)}` : ""}`;
    }
    if (kind === "odometer") return `${date} · ${num(hass, v.odometer as number, 0)} ${unit}`;
    const due = [
      typeof v.due_date === "string" ? shortDate(hass, v.due_date) : "",
      typeof v.due_odometer === "number" ? `${num(hass, v.due_odometer, 0)} ${unit}` : "",
    ].filter(Boolean);
    return [String(v.label ?? ""), ...due].join(" · ");
  }

  private _renderPreview(p: ImportPreview) {
    const hass = this.hass;
    const kind = t(hass, `import.kind_${p.kind}` as Key);
    return html`
      <p aria-live="polite">${t(hass, "import.summary", { kind, ...p.counts })}</p>
      ${p.new_categories.length
        ? html`<p>${t(hass, "import.new_categories", { names: p.new_categories.join(", ") })}</p>`
        : nothing}
      ${p.lines.length
        ? html`<ul class="lines">
            ${p.lines.map(
              (line) => html`<li>
                <span class="status ${line.status}">
                  ${t(hass, `import.status_${line.status as ImportStatus}` as Key)}
                </span>
                <span class="detail">
                  <span class="line-number">${t(hass, "import.line", { line: line.line })}</span>
                  —
                  ${line.status === "error"
                    ? line.message
                    : line.values
                      ? this._describe(p.kind, line.values)
                      : ""}
                </span>
              </li>`,
            )}
          </ul>`
        : nothing}
      ${p.truncated ? html`<p class="muted">${t(hass, "import.truncated")}</p>` : nothing}
    `;
  }

  protected override render() {
    if (!this.vehicle) return nothing;
    const hass = this.hass;
    const toImport = this._preview?.counts.new ?? 0;
    return html`<dialog aria-labelledby="import-title">
      <form
        method="dialog"
        @submit=${(e: Event) => {
          e.preventDefault();
          if (toImport) void this._apply();
        }}
      >
        <header>
          <h2 id="import-title">${t(hass, "import.title")} · ${this.vehicle.name}</h2>
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
          <p class="muted" id="import-help">${t(hass, "import.help")}</p>
          <div class="field">
            <label for="file">${t(hass, "import.file")}</label>
            <input
              id="file"
              type="file"
              accept=".csv,text/csv"
              aria-describedby="import-help"
              @change=${(e: Event) =>
                this._analyse((e.target as HTMLInputElement).files?.[0] ?? null)}
            />
          </div>
          ${this._busy && !this._preview
            ? html`<p aria-live="polite">${t(hass, "import.analyzing")}</p>`
            : nothing}
          ${this._preview ? this._renderPreview(this._preview) : nothing}
          ${this._message ? html`<p role="status">${this._message}</p>` : nothing}
          ${this._error ? html`<p class="error" role="alert">${this._error}</p>` : nothing}
        </div>
        <footer>
          <button type="button" @click=${() => this.close()}>
            ${t(hass, this._message ? "common.close" : "common.cancel")}
          </button>
          ${this._preview
            ? html`<button type="submit" class="primary" ?disabled=${this._busy || !toImport}>
                ${t(hass, "import.confirm", { count: toImport })}
              </button>`
            : nothing}
        </footer>
      </form>
    </dialog>`;
  }
}
