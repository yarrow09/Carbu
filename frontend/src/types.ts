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
}
