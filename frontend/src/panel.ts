// Page « Carbu » de la barre latérale : les trois cartes du véhicule choisi.
//
// Le tableau de bord « Vue d'ensemble » de Home Assistant ne permet pas
// d'ajouter des cartes personnalisées ; cette page donne un accès direct à la
// saisie des pleins et des frais, sans configuration.
import { css, html, LitElement, nothing } from "lit";

import { fetchVehicles, subscribeUpdates } from "./api";
import { icon } from "./components/icon";
import { t, type Key } from "./i18n";
import { readPref, writePref } from "./prefs";
import { mdiCashPlus, mdiGasStation, sharedStyles } from "./styles";
import type { CardConfig, HomeAssistant, VehicleView } from "./types";

declare const __CARBU_VERSION__: string;

/** Version du bundle chargé dans le navigateur (fixée à la construction). */
export const PAGE_VERSION = __CARBU_VERSION__;

// Titres courts : la page porte déjà le nom de l'application.
// Les dernières entrées sont dans le journal (5 à la fois) : la carte principale
// ne les répète pas.
// Carnet et journal côte à côte, statistiques en pleine largeur dessous.
const CARDS = [
  { type: "carbu-card", section: "overview", extra: { show_recent: false, show_actions: false } },
  {
    type: "carbu-journal-card",
    section: "journal",
    extra: { title: "panel.journal", page_size: 5 },
  },
  { type: "carbu-stats-card", section: "stats", extra: { title: "panel.stats" } },
] as const;

type CardElement = HTMLElement & {
  hass?: HomeAssistant;
  setConfig(config: CardConfig): void;
  openFuel?(): void;
  openExpense?(): void;
};

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
        color: var(--primary-text-color);
        /* Fond sobre avec deux halos de la couleur d'accent. */
        background:
          radial-gradient(
            60rem 30rem at 0% -10%,
            color-mix(in srgb, var(--vl-accent) 14%, transparent),
            transparent 70%
          ),
          radial-gradient(
            50rem 30rem at 110% 10%,
            color-mix(in srgb, var(--vl-accent-2) 9%, transparent),
            transparent 70%
          ),
          var(--primary-background-color);
        background-attachment: fixed;
      }
      .toolbar {
        position: sticky;
        top: 0;
        z-index: 2;
        display: flex;
        align-items: center;
        gap: 8px;
        min-height: var(--header-height, 56px);
        padding: 0 12px;
        box-sizing: border-box;
        background: color-mix(in srgb, var(--primary-background-color) 72%, transparent);
        backdrop-filter: blur(14px) saturate(140%);
        -webkit-backdrop-filter: blur(14px) saturate(140%);
        border-bottom: 1px solid color-mix(in srgb, var(--primary-text-color) 8%, transparent);
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        flex: 1;
        min-width: 0;
      }
      .logo {
        flex: none;
        width: 30px;
        height: 30px;
        border-radius: 10px;
        background: var(--vl-gradient);
        box-shadow: 0 6px 18px -6px color-mix(in srgb, var(--vl-accent) 80%, transparent);
        display: grid;
        place-items: center;
        color: #0b1218;
      }
      .logo svg {
        width: 18px;
        height: 18px;
        fill: currentColor;
      }
      .quick {
        display: flex;
        gap: 6px;
      }
      .nav {
        display: flex;
        gap: 6px;
        overflow-x: auto;
        max-width: 1400px;
        margin: 0 auto;
        padding: 12px 16px 0;
        scrollbar-width: none;
      }
      .nav button {
        flex: none;
        min-height: 34px;
        padding: 0 14px;
        font-size: 0.875rem;
        border-color: color-mix(in srgb, var(--primary-text-color) 14%, transparent);
        background: var(--vl-surface);
      }
      @media (max-width: 600px) {
        .quick .label {
          display: none;
        }
        .quick button {
          padding: 0 10px;
        }
      }
      .title {
        font-size: 20px;
        font-weight: 650;
        letter-spacing: -0.01em;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      select {
        width: auto;
        max-width: 40vw;
        min-height: 36px;
        font: inherit;
        padding: 0 12px;
        border-radius: 999px;
        border: 1px solid color-mix(in srgb, var(--primary-text-color) 18%, transparent);
        background: var(--vl-surface);
        color: inherit;
      }
      select option {
        color: var(--primary-text-color);
        background: var(--card-background-color);
      }
      .content {
        display: grid;
        gap: 16px;
        padding: 12px 16px 16px;
        max-width: 1400px;
        margin: 0 auto;
        grid-template-columns: minmax(0, 1fr);
        align-items: start;
      }
      /* Écran large : la carte principale prend plus de place que le journal. */
      @media (min-width: 1100px) {
        .content {
          grid-template-columns: minmax(0, 3fr) minmax(0, 2fr);
        }
      }
      .wide {
        grid-column: 1 / -1;
      }
      /* Sous la barre d'outils collante quand on saute à une section. */
      .content > * {
        scroll-margin-top: calc(var(--header-height, 56px) + 16px);
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
    this._vehicleId = readPref("panel-vehicle");
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
      this._cards = CARDS.map(({ type, section, extra }) => {
        const card = document.createElement(type) as CardElement;
        card.id = `section-${section}`;
        const config: CardConfig = { type: `custom:${type}`, vehicle_id: vehicleId };
        if ("show_recent" in extra) config.show_recent = extra.show_recent;
        if ("show_actions" in extra) config.show_actions = extra.show_actions;
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

  /** Carte principale (saisie d'un plein ou d'une dépense). */
  private _mainCard(): CardElement | undefined {
    return this._cards.find((c) => c.id === "section-overview");
  }

  private _goTo(section: string): void {
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    this.renderRoot
      .querySelector(`#section-${section}`)
      ?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  }

  private _select(ev: Event): void {
    const id = (ev.target as HTMLSelectElement).value;
    this._vehicleId = id;
    writePref("panel-vehicle", id);
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
        <div class="brand">
          <span class="logo" aria-hidden="true">${icon(mdiGasStation)}</span>
          <h1 class="title">Carbu</h1>
        </div>
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
        ${vehicle
          ? html`<div class="quick">
              <button
                class="primary"
                aria-label=${t(this.hass, "action.add_fuel_long")}
                @click=${() => this._mainCard()?.openFuel?.()}
              >
                ${icon(mdiGasStation)}<span class="label">${t(this.hass, "action.add_fuel")}</span>
              </button>
              <button
                aria-label=${t(this.hass, "action.add_expense_long")}
                @click=${() => this._mainCard()?.openExpense?.()}
              >
                ${icon(mdiCashPlus)}<span class="label">${t(this.hass, "action.add_expense")}</span>
              </button>
            </div>`
          : nothing}
      </div>
      ${vehicle && !this._loading && !this._error
        ? html`<nav class="nav" aria-label=${t(this.hass, "panel.sections")}>
            ${CARDS.map(
              ({ section }) =>
                html`<button @click=${() => this._goTo(section)}>
                  ${t(this.hass, `panel.section_${section}` as Key)}
                </button>`,
            )}
          </nav>`
        : nothing}
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
