// Logique commune : chargement, abonnement aux mises à jour, choix du véhicule.
import { LitElement, type PropertyValues } from "lit";

import { fetchVehicles, subscribeUpdates } from "../api";
import type { CardConfig, HomeAssistant, VehicleView } from "../types";

export abstract class VehicleCardBase extends LitElement {
  static override properties = {
    hass: { attribute: false },
    _config: { state: true },
    _error: { state: true },
    _loading: { state: true },
  };

  declare hass: HomeAssistant;
  declare _config: CardConfig;
  declare _error: string;
  declare _loading: boolean;
  protected _vehicles: VehicleView[] = [];
  protected _currency = "EUR";
  private _unsubscribe?: Promise<() => Promise<void>>;
  private _reloadTimer?: number;

  constructor() {
    super();
    this._error = "";
    this._loading = true;
  }

  setConfig(config: CardConfig): void {
    if (!config) throw new Error("Invalid configuration");
    const changed = this._config?.vehicle_id !== config.vehicle_id;
    this._config = { show_chart: true, show_recent: true, ...config };
    if (this._started && changed) void this.reload();
    else this._start();
  }

  /** Véhicule affiché : celui configuré, sinon le premier. */
  protected get vehicle(): VehicleView | undefined {
    return (
      this._vehicles.find((v) => v.id === this._config?.vehicle_id) ?? this._vehicles[0]
    );
  }

  private _started = false;

  /** Premier chargement dès que la carte est connectée et que `hass` est connu. */
  private _start(): void {
    if (this._started || !this.hass || !this.isConnected || !this._config) return;
    this._started = true;
    void this.reload();
  }

  protected override updated(changed: PropertyValues): void {
    if (changed.has("hass")) {
      this._start();
      this._subscribe();
    }
  }

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.hass) {
      this._subscribe();
      this._start();
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this._started = false;
    const pending = this._unsubscribe;
    this._unsubscribe = undefined;
    void pending?.then((unsub) => unsub()).catch(() => undefined);
  }

  private _subscribe(): void {
    if (this._unsubscribe || !this.isConnected) return;
    this._unsubscribe = subscribeUpdates(this.hass, () => {
      // Regroupe les rafales de notifications.
      window.clearTimeout(this._reloadTimer);
      this._reloadTimer = window.setTimeout(() => void this.reload(), 300);
    });
    this._unsubscribe.catch(() => {
      this._unsubscribe = undefined;
    });
  }

  async reload(): Promise<void> {
    try {
      const result = await fetchVehicles(this.hass);
      this._vehicles = result.vehicles;
      this._currency = result.currency;
      this._error = "";
      await this.loadVehicleData();
    } catch (err) {
      this._error = (err as { code?: string; message?: string }).code ?? (err as Error).message;
    } finally {
      this._loading = false;
      this.requestUpdate();
    }
  }

  /** Données propres à la carte pour le véhicule courant. */
  protected abstract loadVehicleData(): Promise<void>;
}
