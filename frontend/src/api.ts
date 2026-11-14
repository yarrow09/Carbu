// Appels à l'API websocket interne de l'intégration.
import type {
  Category,
  Dashboard,
  ExpenseView,
  FuelDefaults,
  FuelEntryView,
  FuelSaveResult,
  HomeAssistant,
  ImportPreview,
  ImportResult,
  Page,
  RecurringView,
  ReminderView,
  StatsPeriod,
  StatsView,
  VehicleView,
} from "./types";

const P = "carbu";

export const fetchVehicles = (hass: HomeAssistant) =>
  hass.callWS<{ currency: string; version?: string; vehicles: VehicleView[] }>({
    type: `${P}/vehicles`,
  });

export const fetchDashboard = (hass: HomeAssistant, vehicleId: string) =>
  hass.callWS<Dashboard>({ type: `${P}/dashboard`, vehicle_id: vehicleId });

export const fetchCategories = (hass: HomeAssistant) =>
  hass.callWS<Category[]>({ type: `${P}/categories` });

export const fetchFuelDefaults = (hass: HomeAssistant, vehicleId: string) =>
  hass.callWS<FuelDefaults>({ type: `${P}/fuel/defaults`, vehicle_id: vehicleId });

export const listFuel = (
  hass: HomeAssistant,
  vehicleId: string,
  params: { start?: string; end?: string; limit?: number; offset?: number } = {},
) =>
  hass.callWS<Page<FuelEntryView>>({
    type: `${P}/fuel/list`,
    vehicle_id: vehicleId,
    ...params,
  });

export const saveFuel = (
  hass: HomeAssistant,
  vehicleId: string,
  payload: Record<string, unknown>,
) =>
  hass.callWS<FuelSaveResult>({
    type: `${P}/fuel/save`,
    vehicle_id: vehicleId,
    ...payload,
  });

export const deleteFuel = (hass: HomeAssistant, vehicleId: string, entryId: string) =>
  hass.callWS<null>({ type: `${P}/fuel/delete`, vehicle_id: vehicleId, entry_id: entryId });

export interface ExpenseFilters {
  start?: string;
  end?: string;
  category_ids?: string[];
  min_amount?: number;
  max_amount?: number;
  limit?: number;
  offset?: number;
}

export const listExpenses = (
  hass: HomeAssistant,
  vehicleId: string,
  filters: ExpenseFilters = {},
) =>
  hass.callWS<Page<ExpenseView>>({
    type: `${P}/expense/list`,
    vehicle_id: vehicleId,
    ...filters,
  });

export const saveExpense = (
  hass: HomeAssistant,
  vehicleId: string,
  payload: Record<string, unknown>,
) =>
  hass.callWS<ExpenseView>({
    type: `${P}/expense/save`,
    vehicle_id: vehicleId,
    ...payload,
  });

export const deleteExpense = (hass: HomeAssistant, vehicleId: string, expenseId: string) =>
  hass.callWS<null>({
    type: `${P}/expense/delete`,
    vehicle_id: vehicleId,
    expense_id: expenseId,
  });

const attachmentPath = (vehicleId: string, expenseId: string) =>
  `/api/${P}/attachment/${encodeURIComponent(vehicleId)}/${encodeURIComponent(expenseId)}`;

export async function uploadAttachment(
  hass: HomeAssistant,
  vehicleId: string,
  expenseId: string,
  file: File,
): Promise<void> {
  const body = new FormData();
  body.append("file", file);
  const response = await hass.fetchWithAuth(attachmentPath(vehicleId, expenseId), {
    method: "POST",
    body,
  });
  if (!response.ok) {
    let code = String(response.status);
    try {
      code = ((await response.json()) as { code?: string }).code ?? code;
    } catch {
      /* réponse non JSON */
    }
    throw new Error(code);
  }
}

export async function removeAttachment(
  hass: HomeAssistant,
  vehicleId: string,
  expenseId: string,
): Promise<void> {
  await hass.fetchWithAuth(attachmentPath(vehicleId, expenseId), { method: "DELETE" });
}

/** URL signée (valable 30 s) pour ouvrir la pièce jointe dans un onglet. */
export async function attachmentUrl(
  hass: HomeAssistant,
  vehicleId: string,
  expenseId: string,
): Promise<string> {
  const { path } = await hass.callWS<{ path: string }>({
    type: "auth/sign_path",
    path: attachmentPath(vehicleId, expenseId),
    expires: 30,
  });
  return path;
}

export const subscribeUpdates = (hass: HomeAssistant, callback: () => void) =>
  hass.connection.subscribeMessage<unknown>(() => callback(), { type: `${P}/subscribe` });

export const fetchReminders = (hass: HomeAssistant, vehicleId: string) =>
  hass.callWS<ReminderView[]>({ type: `${P}/reminders`, vehicle_id: vehicleId });

export const saveReminder = (
  hass: HomeAssistant,
  vehicleId: string,
  payload: Record<string, unknown>,
) =>
  hass.callWS<ReminderView>({
    type: `${P}/reminder/save`,
    vehicle_id: vehicleId,
    ...payload,
  });

export const deleteReminder = (hass: HomeAssistant, vehicleId: string, reminderId: string) =>
  hass.callWS<null>({
    type: `${P}/reminder/delete`,
    vehicle_id: vehicleId,
    reminder_id: reminderId,
  });

export const markReminderDone = (
  hass: HomeAssistant,
  vehicleId: string,
  reminderId: string,
) =>
  hass.callWS<ReminderView>({
    type: `${P}/reminder/done`,
    vehicle_id: vehicleId,
    reminder_id: reminderId,
  });

export const fetchStats = (hass: HomeAssistant, vehicleId: string, period: StatsPeriod) =>
  hass.callWS<StatsView>({ type: `${P}/stats`, vehicle_id: vehicleId, period });

/** Analyse (``apply`` faux) ou import (``apply`` vrai) d'un fichier CSV. */
export async function importCsv(
  hass: HomeAssistant,
  vehicleId: string,
  file: File,
  apply: boolean,
): Promise<ImportPreview | ImportResult> {
  const body = new FormData();
  body.append("file", file);
  const path = `/api/${P}/import/${encodeURIComponent(vehicleId)}${apply ? "?apply=1" : ""}`;
  const response = await hass.fetchWithAuth(path, { method: "POST", body });
  const payload = (await response.json().catch(() => ({}))) as Record<string, unknown>;
  if (!response.ok) throw new Error(String(payload.code ?? response.status));
  return payload as unknown as ImportPreview | ImportResult;
}

export const fetchRecurring = (hass: HomeAssistant, vehicleId: string) =>
  hass.callWS<RecurringView[]>({ type: `${P}/recurring`, vehicle_id: vehicleId });

export const saveRecurring = (
  hass: HomeAssistant,
  vehicleId: string,
  payload: Record<string, unknown>,
) =>
  hass.callWS<RecurringView>({
    type: `${P}/recurring/save`,
    vehicle_id: vehicleId,
    ...payload,
  });

export const deleteRecurring = (hass: HomeAssistant, vehicleId: string, recurringId: string) =>
  hass.callWS<null>({
    type: `${P}/recurring/delete`,
    vehicle_id: vehicleId,
    recurring_id: recurringId,
  });

/** Contenu des fichiers CSV d'un véhicule ``{nom: texte}``. */
export const fetchExport = (hass: HomeAssistant, vehicleId: string) =>
  hass.callWS<{ files: Record<string, string>; rows: Record<string, number> }>({
    type: `${P}/export`,
    vehicle_id: vehicleId,
  });
