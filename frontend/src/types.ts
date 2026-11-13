// Types partagés : sous-ensemble de l'objet `hass` et réponses de l'API websocket.

export interface HomeAssistant {
  language: string;
  locale?: { language: string };
  callWS<T>(msg: Record<string, unknown>): Promise<T>;
  fetchWithAuth(path: string, init?: RequestInit): Promise<Response>;
  connection: {
    subscribeMessage<T>(
      callback: (message: T) => void,
      subscribeMessage: Record<string, unknown>,
    ): Promise<() => Promise<void>>;
  };
}

export type FuelType = "gasoline" | "diesel" | "lpg" | "cng";
export type FuelGrade = "e10" | "sp95" | "sp98";

export interface Units {
  distance: string;
  volume: Record<string, string>;
  consumption: Record<string, string>;
}

export interface Summary {
  consumption: Record<string, number | null>;
  last_consumption: Record<string, number | null>;
  current_odometer: number | null;
  total_distance: number | null;
  distance_week: number | null;
  distance_month: number | null;
  distance_year: number | null;
  month_cost: number;
  month_fuel_cost: number;
  month_expense_cost: number;
  total_cost: number;
  cost_per_distance: number | null;
  fuel_cost_per_distance: number | null;
  fill_count: number;
  expense_count: number;
}

export interface VehicleView {
  id: string;
  name: string;
  make: string;
  model: string;
  fuel_types: FuelType[];
  tank_capacity: Record<string, number | null>;
  units: Units;
  summary: Summary | null;
}

export interface FuelEntryView {
  id: string;
  date: string;
  time: string | null;
  odometer: number;
  volume: number;
  unit_price: number;
  total_cost: number;
  fuel_type: FuelType;
  full_tank: boolean;
  station: string | null;
  notes: string;
  grade: FuelGrade | null;
  /** Distance depuis le plein précédent (listes uniquement). */
  distance?: number | null;
  /** Consommation mesurée à ce plein complet (listes uniquement). */
  consumption?: number | null;
}

export interface ExpenseView {
  id: string;
  date: string;
  odometer: number | null;
  amount: number;
  category_id: string;
  description: string;
  attachment: string | null;
}

export interface Category {
  id: string;
  name: string | null;
  color: string | null;
  icon: string | null;
  builtin: boolean;
  label: string;
}

export interface MonthlyBucket {
  month: string;
  values: Record<string, number>;
}

export interface Dashboard extends VehicleView {
  currency: string;
  recent_fuel: FuelEntryView[];
  last_fuel: FuelEntryView | null;
  recent_expenses: ExpenseView[];
  monthly: MonthlyBucket[];
  categories: Category[];
}

export interface CoherenceWarning {
  code: string;
  details: Record<string, number | string | null>;
}

export interface FuelSaveResult {
  saved: boolean;
  warnings: CoherenceWarning[];
  entry?: FuelEntryView;
}

export interface FuelDefaults {
  date: string;
  time: string;
  odometer: number | null;
  fuel_type: FuelType;
  grade: FuelGrade | null;
  unit_price: Record<string, number | null>;
}

export interface Page<T> {
  total: number;
  items: T[];
  sum?: number;
}

export interface CardConfig {
  type: string;
  vehicle_id?: string;
  title?: string;
  show_chart?: boolean;
  show_recent?: boolean;
  show_last_fill?: boolean;
  show_reminders?: boolean;
  period?: StatsPeriod;
  /** Journal : nombre d'entrées chargées à la fois. */
  page_size?: number;
}

export type ReminderKind = "date" | "distance" | "both";
export type ReminderState = "ok" | "alert" | "due" | "inactive";

export interface ReminderView {
  id: string;
  label: string;
  kind: ReminderKind;
  due_date: string | null;
  due_odometer: number | null;
  alert_days: number | null;
  alert_distance: number | null;
  interval_days: number | null;
  interval_distance: number | null;
  active: boolean;
  recurring: boolean;
  last_done_date: string | null;
  last_done_odometer: number | null;
  state: ReminderState;
  days_left: number | null;
  distance_left: number | null;
  criterion: "date" | "distance" | null;
}

export type StatsPeriod = "30d" | "3m" | "12m" | "all";

export interface ConsumptionPoint {
  entry_id: string;
  date: string;
  odometer: number;
  value: number;
  moving_average: number;
}

export interface StatsView {
  start: string;
  end: string;
  days: number;
  distance: number;
  fuel_volume: Record<string, number>;
  consumption: Record<string, number | null>;
  fuel_cost: number;
  expense_cost: number;
  total_cost: number;
  cost_per_distance: number | null;
  fuel_cost_per_distance: number | null;
  expenses_by_category: Record<string, number>;
  fill_count: number;
  expense_count: number;
  moving_average_window: number;
  series: Record<string, ConsumptionPoint[]>;
  prices: Record<string, PricePoint[]>;
  co2_kg: number;
  co2_per_distance: number | null;
}

export interface PricePoint {
  entry_id: string;
  date: string;
  value: number;
  grade: FuelGrade | null;
}

export type ImportKind = "fuel" | "expenses" | "odometer" | "reminders";
export type ImportStatus = "new" | "duplicate" | "error";

export interface ImportPreview {
  kind: ImportKind;
  counts: Record<ImportStatus, number>;
  new_categories: string[];
  lines: {
    line: number;
    status: ImportStatus;
    message: string | null;
    values: Record<string, unknown> | null;
  }[];
  truncated: boolean;
}

export interface ImportResult {
  added: number;
  counts: Record<ImportStatus, number>;
}
