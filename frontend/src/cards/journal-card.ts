// Journal : tous les pleins et toutes les dépenses, filtrables, modifiables.
import { css, html, nothing } from "lit";

import {
  deleteExpense,
  deleteFuel,
  type ExpenseFilters,
  fetchCategories,
  listExpenses,
  listFuel,
} from "../api";
import type { VlConfirmDialog } from "../components/confirm-dialog";
import type { VlExpenseDialog } from "../components/expense-dialog";
import type { VlFuelDialog } from "../components/fuel-dialog";
import { icon } from "../components/icon";
import { isoDate, money, num, parseNumber, shortDate } from "../format";
import { t } from "../i18n";
import { mdiDelete, mdiPaperclip, mdiPencil, mdiPlus, sharedStyles } from "../styles";
import type { CardConfig, Category, ExpenseView, FuelEntryView } from "../types";
import { VehicleCardBase } from "./base";
import { listStyles } from "./dashboard-card";

const PAGE = 25;
type Tab = "fuel" | "expenses";
type Preset = "month" | "3m" | "year" | "all";

function presetRange(preset: Preset): { start?: string; end?: string } {
  const now = new Date();
  if (preset === "month") return { start: isoDate(new Date(now.getFullYear(), now.getMonth(), 1)) };
  if (preset === "3m") return { start: isoDate(new Date(now.getFullYear(), now.getMonth() - 2, 1)) };
  if (preset === "year") return { start: isoDate(new Date(now.getFullYear(), 0, 1)) };
  return {};
}

export class VehicleLogJournalCard extends VehicleCardBase {
  static override properties = {
    ...VehicleCardBase.properties,
    _tab: { state: true },
    _fuel: { state: true },
    _expenses: { state: true },
    _fuelTotal: { state: true },
    _expenseTotal: { state: true },
    _expenseSum: { state: true },
    _categories: { state: true },
    _filters: { state: true },
  };
  static override styles = [
    sharedStyles,
    listStyles,
    css`
      ha-card {
        padding: 16px;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      .head {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
        flex-wrap: wrap;
      }
      h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 500;
      }
      [role="tablist"] {
        display: flex;
        gap: 4px;
        border-bottom: 1px solid var(--vl-border);
      }
      [role="tab"] {
        border: none;
        border-bottom: 3px solid transparent;
        border-radius: 0;
      }
      [role="tab"][aria-selected="true"] {
        border-bottom-color: var(--primary-color);
        font-weight: 500;
      }
      fieldset {
        border: 1px solid var(--vl-border);
        border-radius: 10px;
        padding: 8px 12px 12px;
        margin: 0;
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 8px 12px;
      }
      legend {
        padding: 0 4px;
        color: var(--vl-muted);
      }
      .presets,
      .chips {
        grid-column: 1 / -1;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
      }
      .chips label {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        border: 1px solid var(--vl-input-border);
        border-radius: 999px;
        padding: 2px 10px 2px 6px;
        min-height: 32px;
      }
      .summary {
        color: var(--vl-muted);
        font-size: 0.875rem;
      }
      .more {
        align-self: center;
      }
    `,
  ];

  declare _tab: Tab;
  declare _fuel: FuelEntryView[];
  declare _expenses: ExpenseView[];
  declare _fuelTotal: number;
  declare _expenseTotal: number;
  declare _expenseSum: number;
  declare _categories: Category[];
  declare _filters: ExpenseFilters & { preset?: Preset };

  constructor() {
    super();
    this._tab = "fuel";
    this._fuel = [];
    this._expenses = [];
    this._fuelTotal = 0;
    this._expenseTotal = 0;
    this._expenseSum = 0;
    this._categories = [];
    this._filters = { preset: "all" };
  }

  static getStubConfig(): CardConfig {
    return { type: "custom:vehicle-log-journal-card" };
  }

  static async getConfigElement(): Promise<HTMLElement> {
    const editor = document.createElement("vehicle-log-card-editor");
    editor.setAttribute("kind", "journal");
    return editor;
  }

  getCardSize(): number {
    return 10;
  }

  getGridOptions() {
    return { columns: 12, min_columns: 6, rows: "auto" };
  }

  protected async loadVehicleData(): Promise<void> {
    const vehicle = this.vehicle;
    if (!vehicle) return;
    const [categories] = await Promise.all([
      fetchCategories(this.hass),
      this._loadFuel(false),
      this._loadExpenses(false),
    ]);
    this._categories = categories;
  }

  private async _loadFuel(append: boolean): Promise<void> {
    const vehicle = this.vehicle;
    if (!vehicle) return;
    const page = await listFuel(this.hass, vehicle.id, {
      limit: PAGE,
      offset: append ? this._fuel.length : 0,
    });
    this._fuel = append ? [...this._fuel, ...page.items] : page.items;
    this._fuelTotal = page.total;
  }

  private _apiFilters(): ExpenseFilters {
    const { preset: _preset, ...filters } = this._filters;
    return filters;
  }

  private async _loadExpenses(append: boolean): Promise<void> {
    const vehicle = this.vehicle;
    if (!vehicle) return;
    const page = await listExpenses(this.hass, vehicle.id, {
      ...this._apiFilters(),
      limit: PAGE,
      offset: append ? this._expenses.length : 0,
    });
    this._expenses = append ? [...this._expenses, ...page.items] : page.items;
    this._expenseTotal = page.total;
    this._expenseSum = page.sum ?? 0;
  }

  private _setFilters(patch: Partial<ExpenseFilters & { preset?: Preset }>): void {
    const next = { ...this._filters, ...patch } as Record<string, unknown>;
    for (const [key, value] of Object.entries(next)) {
      if (value === undefined || value === null || value === "") delete next[key];
    }
    this._filters = next as ExpenseFilters & { preset?: Preset };
    void this._loadExpenses(false);
  }

  private _preset(preset: Preset): void {
    const range = presetRange(preset);
    this._setFilters({ preset, start: range.start, end: undefined });
  }

  private _toggleCategory(id: string, checked: boolean): void {
    const current = new Set(this._filters.category_ids ?? []);
    if (checked) current.add(id);
    else current.delete(id);
    this._setFilters({ category_ids: current.size ? [...current] : undefined });
  }

  private _confirm(): VlConfirmDialog {
    return this.renderRoot.querySelector("vl-confirm-dialog") as VlConfirmDialog;
  }

  private async _deleteFuel(e: FuelEntryView): Promise<void> {
    const vehicle = this.vehicle;
    if (!vehicle) return;
    if (await this._confirm().ask(t(this.hass, "fuel.delete_confirm", { date: shortDate(this.hass, e.date) }))) {
      await deleteFuel(this.hass, vehicle.id, e.id);
      await this.reload();
    }
  }

  private async _deleteExpense(e: ExpenseView): Promise<void> {
    const vehicle = this.vehicle;
    if (!vehicle) return;
    const message = t(this.hass, "expense.delete_confirm", {
      date: shortDate(this.hass, e.date),
      amount: money(this.hass, e.amount, this._currency),
    });
    if (await this._confirm().ask(message)) {
      await deleteExpense(this.hass, vehicle.id, e.id);
      await this.reload();
    }
  }

  private _tabButton(tab: Tab, label: string) {
    const selected = this._tab === tab;
    return html`<button
      role="tab"
      id="tab-${tab}"
      aria-selected=${selected ? "true" : "false"}
      aria-controls="panel-${tab}"
      tabindex=${selected ? 0 : -1}
      @click=${() => (this._tab = tab)}
      @keydown=${(e: KeyboardEvent) => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
          this._tab = this._tab === "fuel" ? "expenses" : "fuel";
          void this.updateComplete.then(() =>
            this.renderRoot.querySelector<HTMLButtonElement>(`#tab-${this._tab}`)?.focus(),
          );
        }
      }}
    >
      ${label}
    </button>`;
  }

  private _fuelPanel() {
    const hass = this.hass;
    const vehicle = this.vehicle!;
    return html`<div role="tabpanel" id="panel-fuel" aria-labelledby="tab-fuel">
      ${this._fuel.length
        ? html`<ul class="entries">
            ${this._fuel.map((e) => {
              const unit = vehicle.units.volume[e.fuel_type] ?? "L";
              const label = `${shortDate(hass, e.date)} · ${num(hass, e.volume, 2)} ${unit}`;
              return html`<li>
                <div class="entry-main">
                  <span class="entry-title">
                    <span>${label}${e.full_tank ? nothing : html` <span class="badge">${t(hass, "fuel.partial")}</span>`}</span>
                    <span class="amount">${money(hass, e.total_cost, this._currency)}</span>
                  </span>
                  <span class="entry-sub">
                    ${num(hass, e.odometer, 0)} ${vehicle.units.distance} ·
                    ${money(hass, e.unit_price, this._currency, 3)}/${unit}${e.station ? ` · ${e.station}` : ""}${e.notes ? ` · ${e.notes}` : ""}
                  </span>
                </div>
                <span class="row-actions">
                  <button class="icon" aria-label="${t(hass, "common.edit")} : ${label}"
                    @click=${() => (this.renderRoot.querySelector("vl-fuel-dialog") as VlFuelDialog).open(e)}>
                    ${icon(mdiPencil)}
                  </button>
                  <button class="icon" aria-label="${t(hass, "common.delete")} : ${label}"
                    @click=${() => this._deleteFuel(e)}>
                    ${icon(mdiDelete)}
                  </button>
                </span>
              </li>`;
            })}
          </ul>`
        : html`<p class="empty">${t(hass, "common.none")}</p>`}
      ${this._fuel.length < this._fuelTotal
        ? html`<button class="more" @click=${() => this._loadFuel(true)}>${t(hass, "common.load_more")}</button>`
        : nothing}
    </div>`;
  }

  private _filtersForm() {
    const hass = this.hass;
    const f = this._filters;
    const presets: [Preset, string][] = [
      ["month", t(hass, "journal.period_month")],
      ["3m", t(hass, "journal.period_3m")],
      ["year", t(hass, "journal.period_year")],
      ["all", t(hass, "journal.period_all")],
    ];
    const amount = (key: "min_amount" | "max_amount", raw: string) =>
      this._setFilters({ [key]: parseNumber(raw) ?? undefined });
    return html`<fieldset>
      <legend>${t(hass, "journal.filters")}</legend>
      <div class="presets" role="group" aria-label=${t(hass, "journal.filters")}>
        ${presets.map(
          ([p, label]) =>
            html`<button aria-pressed=${f.preset === p ? "true" : "false"} @click=${() => this._preset(p)}>
              ${label}
            </button>`,
        )}
      </div>
      <div class="field">
        <label for="from">${t(hass, "journal.from")}</label>
        <input id="from" type="date" .value=${f.start ?? ""}
          @change=${(e: Event) => this._setFilters({ start: (e.target as HTMLInputElement).value, preset: undefined })} />
      </div>
      <div class="field">
        <label for="to">${t(hass, "journal.to")}</label>
        <input id="to" type="date" .value=${f.end ?? ""}
          @change=${(e: Event) => this._setFilters({ end: (e.target as HTMLInputElement).value, preset: undefined })} />
      </div>
      <div class="field">
        <label for="min">${t(hass, "journal.min")} (${this._currency})</label>
        <input id="min" inputmode="decimal" .value=${f.min_amount !== undefined ? String(f.min_amount) : ""}
          @change=${(e: Event) => amount("min_amount", (e.target as HTMLInputElement).value)} />
      </div>
      <div class="field">
        <label for="max">${t(hass, "journal.max")} (${this._currency})</label>
        <input id="max" inputmode="decimal" .value=${f.max_amount !== undefined ? String(f.max_amount) : ""}
          @change=${(e: Event) => amount("max_amount", (e.target as HTMLInputElement).value)} />
      </div>
      <div class="chips" role="group" aria-label=${t(hass, "journal.categories")}>
        ${this._categories.map(
          (c) => html`<label>
            <input type="checkbox" .checked=${f.category_ids?.includes(c.id) ?? false}
              @change=${(e: Event) => this._toggleCategory(c.id, (e.target as HTMLInputElement).checked)} />
            ${c.label}
          </label>`,
        )}
      </div>
      <div class="presets">
        <button @click=${() => {
          this._filters = { preset: "all" };
          void this._loadExpenses(false);
        }}>${t(hass, "journal.reset")}</button>
      </div>
    </fieldset>`;
  }

  private _expensePanel() {
    const hass = this.hass;
    return html`<div role="tabpanel" id="panel-expenses" aria-labelledby="tab-expenses">
      ${this._filtersForm()}
      <p class="summary" aria-live="polite">
        ${t(hass, "journal.count", {
          count: this._expenseTotal,
          sum: money(hass, this._expenseSum, this._currency),
        })}
      </p>
      ${this._expenses.length
        ? html`<ul class="entries">
            ${this._expenses.map((e) => {
              const category = this._categories.find((c) => c.id === e.category_id);
              const label = `${shortDate(hass, e.date)} · ${category?.label ?? e.category_id}`;
              return html`<li>
                <div class="entry-main">
                  <span class="entry-title">
                    <span>${label}${e.attachment ? html` ${icon(mdiPaperclip)}` : nothing}</span>
                    <span class="amount">${money(hass, e.amount, this._currency)}</span>
                  </span>
                  ${e.description ? html`<span class="entry-sub">${e.description}</span>` : nothing}
                </div>
                <span class="row-actions">
                  <button class="icon" aria-label="${t(hass, "common.edit")} : ${label}"
                    @click=${() => (this.renderRoot.querySelector("vl-expense-dialog") as VlExpenseDialog).open(e)}>
                    ${icon(mdiPencil)}
                  </button>
                  <button class="icon" aria-label="${t(hass, "common.delete")} : ${label}"
                    @click=${() => this._deleteExpense(e)}>
                    ${icon(mdiDelete)}
                  </button>
                </span>
              </li>`;
            })}
          </ul>`
        : html`<p class="empty">${t(hass, "common.none")}</p>`}
      ${this._expenses.length < this._expenseTotal
        ? html`<button class="more" @click=${() => this._loadExpenses(true)}>${t(hass, "common.load_more")}</button>`
        : nothing}
    </div>`;
  }

  protected override render() {
    const hass = this.hass;
    if (this._loading) return html`<ha-card><p>${t(hass, "common.loading")}</p></ha-card>`;
    if (this._error) {
      const message = this._error === "not_loaded" ? t(hass, "common.not_loaded") : this._error;
      return html`<ha-card><p class="error" role="alert">${message}</p></ha-card>`;
    }
    const vehicle = this.vehicle;
    if (!vehicle) return html`<ha-card><p>${t(hass, "common.no_vehicle")}</p></ha-card>`;
    const isFuel = this._tab === "fuel";
    return html`<ha-card>
      <div class="head">
        <h2>${this._config.title || `${t(hass, "journal.name")} · ${vehicle.name}`}</h2>
        <button
          class="primary"
          aria-label=${t(hass, isFuel ? "action.add_fuel_long" : "action.add_expense_long")}
          @click=${() =>
            isFuel
              ? (this.renderRoot.querySelector("vl-fuel-dialog") as VlFuelDialog).open()
              : (this.renderRoot.querySelector("vl-expense-dialog") as VlExpenseDialog).open()}
        >
          ${icon(mdiPlus)} ${t(hass, isFuel ? "action.add_fuel" : "action.add_expense")}
        </button>
      </div>
      <div role="tablist" aria-label=${vehicle.name}>
        ${this._tabButton("fuel", t(hass, "journal.tab_fuel"))}
        ${this._tabButton("expenses", t(hass, "journal.tab_expenses"))}
      </div>
      ${isFuel ? this._fuelPanel() : this._expensePanel()}
      <vl-fuel-dialog .hass=${hass} .vehicle=${vehicle} .currency=${this._currency}
        @saved=${() => this.reload()}></vl-fuel-dialog>
      <vl-expense-dialog .hass=${hass} .vehicle=${vehicle} .categories=${this._categories}
        .currency=${this._currency} @saved=${() => this.reload()}></vl-expense-dialog>
      <vl-confirm-dialog .hass=${hass}></vl-confirm-dialog>
    </ha-card>`;
  }
}
