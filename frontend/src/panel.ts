// Page « Carbu » de la barre latérale : les trois cartes du véhicule choisi.
//
// Le tableau de bord « Vue d'ensemble » de Home Assistant ne permet pas
// d'ajouter des cartes personnalisées ; cette page donne un accès direct à la
// saisie des pleins et des frais, sans configuration.
import { css, html, LitElement, nothing } from "lit";

import { fetchVehicles, subscribeUpdates } from "./api";
import { t } from "./i18n";
import { sharedStyles } from "./styles";
import type { CardConfig, HomeAssistant, VehicleView } from "./types";

declare const __CARBU_VERSION__: string;

/** Version du bundle chargé dans le navigateur (fixée à la construction). */
export const PAGE_VERSION = __CARBU_VERSION__;

const STORAGE_KEY = "carbu-panel-vehicle";
// Titres courts : la page porte déjà le nom de l'application.
// Les dernières entrées sont dans le journal (5 à la fois) : la carte principale
// ne les répète pas.
// Carnet et journal côte à côte, statistiques en pleine largeur dessous.
const CARDS = [
  { type: "carbu-card", extra: { show_recent: false } },
  { type: "carbu-journal-card", extra: { title: "panel.journal", page_size: 5 } },
  { type: "carbu-stats-card", extra: { title: "panel.stats" } },
] as const;

type CardElement = HTMLElement & {
  hass?: HomeAssistant;
  setConfig(config: CardConfig): void;
};

function readStoredVehicle(): string | undefined {
  try {
    return window.localStorage.getItem(STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
}

function storeVehicle(id: string): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, id);
  } catch {
    // Stockage indisponible (navigation privée) : le choix n'est pas retenu.
  }
}

export class CarbuPanel extends LitElement {
  static override properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    _vehicles: { state: true },
    _vehicleId: { state: true },
    _loading: { state: true },
    _error: { state: true },
    _serverVersion: { state: true },
  };

  static override styles = [
    sharedStyles,
    css`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--primary-background-color);
        color: var(--primary-text-color);
      }
      .toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        height: var(--header-height, 56px);
        padding: 0 12px;
        box-sizing: border-box;
        background: var(--app-header-background-color, var(--primary-color));
        color: var(--app-header-text-color, var(--text-primary-color, #fff));
        border-bottom: var(--app-header-border-bottom, none);
      }
      .title {
        flex: 1;
        font-size: 20px;
        font-weight: 400;
        margin: 0 0 0 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      select {
        max-width: 50%;
        font: inherit;
        padding: 6px 8px;
        border-radius: 6px;
        border: 1px solid currentColor;
        background: transparent;
        color: inherit;
      }
      select option {
        color: var(--primary-text-color);
        background: var(--card-background-color);
      }
      .content {
        display: grid;
        gap: 16px;
        padding: 16px;
        max-width: 1400px;
        margin: 0 auto;
        grid-template-columns: repeat(auto-fit, minmax(min(100%, 420px), 1fr));
        align-items: start;
      }
      .wide {
        grid-column: 1 / -1;
      }
      .message {
        padding: 24px 16px;
        max-width: 640px;
        margin: 0 auto;
      }
      .message a {
        color: var(--primary-color);
      }
      .outdated {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px 16px;
        max-width: 1400px;
        margin: 16px auto 0;
        padding: 12px 16px;
        box-sizing: border-box;
        border: 1px solid var(--warning-color, #ffa600);
        border-radius: 10px;
      }
      .outdated p {
        flex: 1 1 280px;
        margin: 0;
      }
      .version {
        text-align: center;
        font-size: 0.75rem;
        color: var(--secondary-text-color);
        padding: 0 16px 16px;
      }
    `,
  ];

  declare hass: HomeAssistant;
  declare narrow: boolean;
  declare _vehicles: VehicleView[];
  declare _vehicleId: string | undefined;
  declare _loading: boolean;
  declare _error: string;
  declare _serverVersion: string | undefined;
  private _cards: CardElement[] = [];
  private _cardsVehicle?: string;
  private _unsubscribe?: Promise<() => Promise<void>>;
  private _started = false;

  constructor() {
    super();
    this.narrow = false;
    this._vehicles = [];
    this._loading = true;
    this._error = "";
    this._vehicleId = readStoredVehicle();
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.hass) this._start();
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._started = false;
    const pending = this._unsubscribe;
    this._unsubscribe = undefined;
    void pending?.then((unsub) => unsub()).catch(() => undefined);
  }

  protected override updated(): void {
    this._start();
    for (const card of this._cards) card.hass = this.hass;
  }

  private _start(): void {
    if (this._started || !this.hass || !this.isConnected) return;
    this._started = true;
    void this._load();
    // Un véhicule ajouté ou renommé met la liste à jour.
    this._unsubscribe = subscribeUpdates(this.hass, () => void this._load());
    this._unsubscribe.catch(() => (this._unsubscribe = undefined));
  }

  private async _load(): Promise<void> {
    try {
      const result = await fetchVehicles(this.hass);
      this._vehicles = result.vehicles;
      this._serverVersion = result.version;
      this._error = "";
    } catch (err) {
      this._error = (err as { code?: string; message?: string }).code ?? (err as Error).message;
    } finally {
      this._loading = false;
    }
  }

  /** Véhicule affiché : le dernier choisi, sinon le premier. */
  private get _current(): VehicleView | undefined {
    return this._vehicles.find((v) => v.id === this._vehicleId) ?? this._vehicles[0];
  }

  /** Cartes du véhicule, recréées seulement quand il change. */
  private _cardsFor(vehicleId: string): CardElement[] {
    if (this._cardsVehicle !== vehicleId) {
      this._cards = CARDS.map(({ type, extra }) => {
        const card = document.createElement(type) as CardElement;
        const config: CardConfig = { type: `custom:${type}`, vehicle_id: vehicleId };
        if ("show_recent" in extra) config.show_recent = extra.show_recent;
        if ("title" in extra) config.title = t(this.hass, extra.title);
        if ("page_size" in extra) config.page_size = extra.page_size;
        card.setConfig(config);
        card.hass = this.hass;
        if (type === "carbu-stats-card") card.classList.add("wide");
        return card;
      });
      this._cardsVehicle = vehicleId;
    }
    return this._cards;
  }

  private _select(ev: Event): void {
    const id = (ev.target as HTMLSelectElement).value;
    this._vehicleId = id;
    storeVehicle(id);
  }

  private _body() {
    const hass = this.hass;
    if (this._loading) return html`<p class="message">${t(hass, "common.loading")}</p>`;
    if (this._error) {
      const message =
        this._error === "not_loaded" ? t(hass, "common.not_loaded") : this._error;
      return html`<p class="message error" role="alert">${message}</p>`;
    }
    const vehicle = this._current;
    if (!vehicle) {
      return html`<p class="message">
        ${t(hass, "panel.no_vehicle")}
        <a href="/config/integrations/integration/carbu">${t(hass, "panel.open_integration")}</a>
      </p>`;
    }
    return html`<div class="content">${this._cardsFor(vehicle.id)}</div>`;
  }

  protected override render() {
    const vehicle = this._current;
    return html`
      <div class="toolbar">
        <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
        <h1 class="title">Carbu</h1>
        ${this._vehicles.length > 1
          ? html`<select
              aria-label=${t(this.hass, "panel.vehicle")}
              .value=${vehicle?.id ?? ""}
              @change=${this._select}
            >
              ${this._vehicles.map(
                (v) =>
                  html`<option value=${v.id} ?selected=${v.id === vehicle?.id}>${v.name}</option>`,
              )}
            </select>`
          : nothing}
      </div>
      ${this._serverVersion && this._serverVersion !== PAGE_VERSION
        ? html`<div class="outdated" role="alert">
            <p>
              ${t(this.hass, "panel.outdated", {
                page: PAGE_VERSION,
                server: this._serverVersion,
              })}
            </p>
            <button @click=${() => window.location.reload()}>${t(this.hass, "panel.reload")}</button>
          </div>`
        : nothing}
      ${this._body()}
      <p class="version">${t(this.hass, "panel.version", { version: PAGE_VERSION })}</p>
    `;
  }
}
