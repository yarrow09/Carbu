// Éditeur graphique des cartes (choix du véhicule, titre, sections).
import { css, html, LitElement, nothing } from "lit";

import { fetchVehicles } from "../api";
import { t } from "../i18n";
import { sharedStyles } from "../styles";
import type { CardConfig, HomeAssistant, VehicleView } from "../types";

export class VehicleLogCardEditor extends LitElement {
  static override properties = {
    hass: { attribute: false },
    kind: { type: String },
    _config: { state: true },
    _vehicles: { state: true },
  };
  static override styles = [
    sharedStyles,
    css`
      :host {
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .check {
        display: flex;
        align-items: center;
        gap: 8px;
      }
    `,
  ];

  declare hass: HomeAssistant;
  declare kind: string;
  declare _config: CardConfig;
  declare _vehicles: VehicleView[];

  constructor() {
    super();
    this.kind = "dashboard";
    this._vehicles = [];
  }

  setConfig(config: CardConfig): void {
    this._config = config;
  }

  protected override firstUpdated(): void {
    void fetchVehicles(this.hass)
      .then((r) => (this._vehicles = r.vehicles))
      .catch(() => undefined);
  }

  private _change(key: keyof CardConfig, value: unknown): void {
    const config = { ...this._config } as Record<string, unknown>;
    if (value === "" || value === undefined) delete config[key];
    else config[key] = value;
    this._config = config as unknown as CardConfig;
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  protected override render() {
    if (!this._config) return nothing;
    const hass = this.hass;
    return html`
      <div class="field">
        <label for="vehicle">${t(hass, "editor.vehicle")}</label>
        <select
          id="vehicle"
          @change=${(e: Event) => this._change("vehicle_id", (e.target as HTMLSelectElement).value)}
        >
          ${this._vehicles.map(
            (v) =>
              html`<option value=${v.id} ?selected=${v.id === this._config.vehicle_id}>
                ${v.name}
              </option>`,
          )}
        </select>
      </div>
      <div class="field">
        <label for="title">${t(hass, "editor.title")}</label>
        <input
          id="title"
          .value=${this._config.title ?? ""}
          @change=${(e: Event) => this._change("title", (e.target as HTMLInputElement).value)}
        />
      </div>
      ${this.kind === "dashboard"
        ? html`<label class="check">
              <input
                type="checkbox"
                .checked=${this._config.show_recent !== false}
                @change=${(e: Event) =>
                  this._change("show_recent", (e.target as HTMLInputElement).checked)}
              />
              ${t(hass, "editor.show_recent")}
            </label>
            <label class="check">
              <input
                type="checkbox"
                .checked=${this._config.show_chart !== false}
                @change=${(e: Event) =>
                  this._change("show_chart", (e.target as HTMLInputElement).checked)}
              />
              ${t(hass, "editor.show_chart")}
            </label>`
        : nothing}
    `;
  }
}
