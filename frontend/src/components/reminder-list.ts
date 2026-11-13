// Liste des rappels d'un véhicule : état, échéance, « Fait », modification.
import { css, html, LitElement, nothing } from "lit";

import { deleteReminder, fetchReminders, markReminderDone } from "../api";
import { num, shortDate } from "../format";
import { t, type Key } from "../i18n";
import { mdiCheck, mdiDelete, mdiPencil, sharedStyles } from "../styles";
import type { HomeAssistant, ReminderView, VehicleView } from "../types";
import type { VlConfirmDialog } from "./confirm-dialog";
import { icon } from "./icon";
import type { VlReminderDialog } from "./reminder-dialog";

const ORDER = { due: 0, alert: 1, ok: 2, inactive: 3 } as const;

export class VlReminderList extends LitElement {
  static override properties = {
    hass: { attribute: false },
    vehicle: { attribute: false },
    _items: { state: true },
  };
  static override styles = [
    sharedStyles,
    css`
      ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }
      li {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 6px 0;
        border-bottom: 1px solid var(--vl-border);
      }
      li:last-child {
        border-bottom: none;
      }
      .main {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
      }
      .sub {
        font-size: 0.875rem;
        color: var(--vl-muted);
      }
      .state {
        flex: none;
        font-size: 0.75rem;
        font-weight: 500;
        padding: 2px 8px;
        border-radius: 999px;
        border: 1px solid currentColor;
      }
      /* Le texte reste lisible : l'état est aussi écrit, pas seulement coloré. */
      .state.due {
        color: var(--vl-error-text);
      }
      .state.alert {
        color: var(--vl-warning-text);
      }
      .state.ok,
      .state.inactive {
        color: var(--vl-muted);
      }
      .actions {
        display: flex;
        flex: none;
      }
      li.inactive .main {
        opacity: 0.7;
      }
    `,
  ];

  declare hass: HomeAssistant;
  declare vehicle: VehicleView;
  declare _items: ReminderView[];

  constructor() {
    super();
    this._items = [];
  }

  async reload(): Promise<void> {
    if (!this.vehicle) return;
    this._items = await fetchReminders(this.hass, this.vehicle.id);
  }

  protected override updated(changed: Map<string, unknown>): void {
    if (changed.has("vehicle") && this.vehicle) void this.reload();
  }

  private _confirm(): VlConfirmDialog {
    return this.renderRoot.querySelector("vl-confirm-dialog") as VlConfirmDialog;
  }

  private async _done(r: ReminderView): Promise<void> {
    const next = t(this.hass, r.recurring ? "reminders.next_recurring" : "reminders.next_once");
    const ok = await this._confirm().ask(
      t(this.hass, "reminders.done_confirm", { label: r.label, next }),
      t(this.hass, "reminders.done"),
      false,
    );
    if (ok) {
      await markReminderDone(this.hass, this.vehicle.id, r.id);
      await this.reload();
    }
  }

  private async _delete(r: ReminderView): Promise<void> {
    if (await this._confirm().ask(t(this.hass, "reminders.delete_confirm", { label: r.label }))) {
      await deleteReminder(this.hass, this.vehicle.id, r.id);
      await this.reload();
    }
  }

  /** Ouvrir le formulaire (nouveau rappel ou modification). */
  openEditor(r: ReminderView | null = null): void {
    void (this.renderRoot.querySelector("vl-reminder-dialog") as VlReminderDialog).open(r);
  }

  private _detail(r: ReminderView): string {
    const hass = this.hass;
    const unit = this.vehicle.units.distance;
    const parts: string[] = [];
    if (r.due_date) {
      const days = r.days_left ?? 0;
      const rel =
        days >= 0
          ? t(hass, "reminders.left_days", { days })
          : t(hass, "reminders.late_days", { days: -days });
      parts.push(`${shortDate(hass, r.due_date)}${r.active ? ` (${rel})` : ""}`);
    }
    if (r.due_odometer !== null) {
      let text = `${num(hass, r.due_odometer, 0)} ${unit}`;
      if (r.active && r.distance_left !== null) {
        const rel =
          r.distance_left >= 0
            ? t(hass, "reminders.left_distance", { distance: num(hass, r.distance_left, 0), unit })
            : t(hass, "reminders.late_distance", { distance: num(hass, -r.distance_left, 0), unit });
        text += ` (${rel})`;
      }
      parts.push(text);
    }
    const every: string[] = [];
    if (r.interval_days) every.push(`${num(hass, r.interval_days, 0)} j`);
    if (r.interval_distance) every.push(`${num(hass, r.interval_distance, 0)} ${unit}`);
    if (every.length) parts.push(t(hass, "reminders.every", { value: every.join(" / ") }));
    return parts.join(" · ");
  }

  protected override render() {
    if (!this.vehicle) return nothing;
    const hass = this.hass;
    const items = [...this._items].sort((a, b) => ORDER[a.state] - ORDER[b.state]);
    return html`
      ${items.length
        ? html`<ul>
            ${items.map(
              (r) => html`<li class=${r.state}>
                <span class="state ${r.state}">${t(hass, `reminders.state_${r.state}` as Key)}</span>
                <div class="main">
                  <span>${r.label}</span>
                  <span class="sub">${this._detail(r)}</span>
                </div>
                <span class="actions">
                  ${r.active
                    ? html`<button
                        class="icon"
                        aria-label=${t(hass, "reminders.done_long", { label: r.label })}
                        @click=${() => this._done(r)}
                      >
                        ${icon(mdiCheck)}
                      </button>`
                    : nothing}
                  <button
                    class="icon"
                    aria-label="${t(hass, "common.edit")} : ${r.label}"
                    @click=${() => this.openEditor(r)}
                  >
                    ${icon(mdiPencil)}
                  </button>
                  <button
                    class="icon"
                    aria-label="${t(hass, "common.delete")} : ${r.label}"
                    @click=${() => this._delete(r)}
                  >
                    ${icon(mdiDelete)}
                  </button>
                </span>
              </li>`,
            )}
          </ul>`
        : html`<p class="empty">${t(hass, "reminders.none")}</p>`}
      <vl-reminder-dialog
        .hass=${hass}
        .vehicle=${this.vehicle}
        @saved=${() => this.reload()}
      ></vl-reminder-dialog>
      <vl-confirm-dialog .hass=${hass}></vl-confirm-dialog>
    `;
  }
}
