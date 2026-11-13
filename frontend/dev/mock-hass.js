// Objet `hass` simulé pour le banc d'essai (ne valide pas la logique serveur,
// testée côté Python) : données du jeu de référence en mémoire.

class HaCard extends HTMLElement {
  constructor() {
    super();
    const root = this.attachShadow({ mode: "open" });
    root.innerHTML = `<style>:host{display:block;background:var(--card-background-color);
      border-radius:12px;box-shadow:0 2px 6px rgba(0,0,0,.15);}</style><slot></slot>`;
  }
}
customElements.define("ha-card", HaCard);

const categories = [
  ["maintenance", "Entretien", "#1e88e5"],
  ["insurance", "Assurance", "#8e24aa"],
  ["parking", "Stationnement", "#00897b"],
  ["toll", "Péage", "#f4511e"],
  ["inspection", "Contrôle technique", "#3949ab"],
  ["repair", "Réparation", "#e53935"],
  ["other", "Autre", "#757575"],
].map(([id, label, color]) => ({ id, name: null, color, icon: null, builtin: true, label }));

let seq = 100;
const fuel = [
  ["f1", "2026-01-05", 10000, 40, 1.8, 72, true],
  ["f2", "2026-01-20", 10600, 36, 1.85, 66.6, true],
  ["f3", "2026-02-03", 10900, 15, 1.9, 28.5, false],
  ["f4", "2026-02-15", 11400, 22.5, 1.8, 40.5, true],
  ["f5", "2026-03-01", 12000, 42, 1.75, 73.5, true],
  ["f6", "2026-03-20", 12300, 20, 1.8, 36, false],
].map(([id, date, odometer, volume, unit_price, total_cost, full_tank]) => ({
  id, date, time: null, odometer, volume, unit_price, total_cost,
  fuel_type: "gasoline", full_tank, station: id === "f5" ? "Total Access" : null, notes: "",
}));
const expenses = [
  ["e1", "2026-01-10", 120, "maintenance", "Vidange + filtre"],
  ["e2", "2026-02-12", 15.4, "toll", "A6"],
  ["e3", "2026-02-25", 4.6, "parking", ""],
  ["e4", "2026-03-05", 300, "insurance", "Échéance annuelle"],
  ["e5", "2026-03-15", 8, "toll", ""],
].map(([id, date, amount, category_id, description]) => ({
  id, date, odometer: null, amount, category_id, description, attachment: id === "e4" ? "e4.pdf" : null,
}));

const vehicle = () => ({
  id: "ref", name: "Clio", make: "Renault", model: "Clio IV",
  fuel_types: ["gasoline"], tank_capacity: { gasoline: 45 },
  units: { distance: "km", volume: { gasoline: "L" }, consumption: { gasoline: "L/100 km" } },
  summary: {
    consumption: { gasoline: 5.775 }, last_consumption: { gasoline: 7 },
    current_odometer: Math.max(...fuel.map((f) => f.odometer)), total_distance: 2300,
    distance_week: 0, distance_month: 300, distance_year: 2300,
    month_cost: 417.5, month_fuel_cost: 109.5, month_expense_cost: 308, total_cost: 765.1,
    cost_per_distance: 0.3327, fuel_cost_per_distance: 0.1379,
    fill_count: fuel.length, expense_count: expenses.length,
  },
});

function monthly() {
  const out = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(2026, 2 - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const values = {};
    for (const f of fuel) if (f.date.startsWith(key)) values.fuel = (values.fuel ?? 0) + f.total_cost;
    for (const e of expenses)
      if (e.date.startsWith(key)) values[e.category_id] = (values[e.category_id] ?? 0) + e.amount;
    out.push({ month: key, values });
  }
  return out;
}
const byDateDesc = (a, b) => (a.date < b.date ? 1 : -1);
let reminders = [
  { id: "r1", label: "Vidange", kind: "both", due_date: "2026-09-01", due_odometer: 12500,
    alert_days: 30, alert_distance: 1000, interval_days: 365, interval_distance: 15000,
    active: true, recurring: true, last_done_date: null, last_done_odometer: null,
    state: "alert", days_left: 160, distance_left: 200, criterion: "distance" },
  { id: "r2", label: "Contrôle technique", kind: "date", due_date: "2026-03-01", due_odometer: null,
    alert_days: 30, alert_distance: null, interval_days: 730, interval_distance: null,
    active: true, recurring: true, last_done_date: null, last_done_odometer: null,
    state: "due", days_left: -24, distance_left: null, criterion: "date" },
  { id: "r3", label: "Pneus hiver", kind: "date", due_date: "2026-11-01", due_odometer: null,
    alert_days: 15, alert_distance: null, interval_days: null, interval_distance: null,
    active: true, recurring: false, last_done_date: null, last_done_odometer: null,
    state: "ok", days_left: 221, distance_left: null, criterion: null },
];
const series = [
  { entry_id: "f2", date: "2026-01-20", odometer: 10600, value: 6.0, moving_average: 6.0 },
  { entry_id: "f4", date: "2026-02-15", odometer: 11400, value: 4.6875, moving_average: 5.25 },
  { entry_id: "f5", date: "2026-03-01", odometer: 12000, value: 7.0, moving_average: 5.775 },
];
const listeners = new Set();
const notify = () => listeners.forEach((cb) => cb({ updated: true }));
const delay = (v) => new Promise((r) => setTimeout(() => r(v), 80));

async function callWS(msg) {
  console.debug("callWS", msg);
  switch (msg.type) {
    case "vehicle_log/vehicles":
      return delay({ currency: "EUR", vehicles: [vehicle()] });
    case "vehicle_log/dashboard":
      return delay({
        ...vehicle(), currency: "EUR", categories, monthly: monthly(),
        recent_fuel: [...fuel].sort(byDateDesc).slice(0, 5),
        recent_expenses: [...expenses].sort(byDateDesc).slice(0, 5),
      });
    case "vehicle_log/categories":
      return delay(categories);
    case "vehicle_log/fuel/defaults":
      return delay({
        date: "2026-03-25", time: "13:00", fuel_type: "gasoline",
        odometer: Math.max(...fuel.map((f) => f.odometer)), unit_price: { gasoline: 1.8 },
      });
    case "vehicle_log/fuel/list": {
      const items = [...fuel].sort(byDateDesc);
      return delay({ total: items.length, items: items.slice(msg.offset ?? 0, (msg.offset ?? 0) + (msg.limit ?? 50)) });
    }
    case "vehicle_log/fuel/save": {
      const last = Math.max(...fuel.filter((f) => f.id !== msg.entry_id).map((f) => f.odometer));
      const volume = msg.volume ?? msg.total_cost / msg.unit_price;
      const warnings = [];
      if (msg.odometer < last) warnings.push({ code: "odometer_below_previous", details: { previous: last } });
      if (volume > 45) warnings.push({ code: "volume_exceeds_tank", details: { capacity: 45 } });
      if (warnings.length && !msg.confirm) return delay({ saved: false, warnings });
      const entry = {
        id: msg.entry_id ?? `f${seq++}`, date: msg.date ?? "2026-03-25", time: msg.time ?? "13:00",
        odometer: msg.odometer, volume, unit_price: msg.unit_price ?? msg.total_cost / volume,
        total_cost: msg.total_cost ?? volume * msg.unit_price, fuel_type: "gasoline",
        full_tank: msg.full_tank, station: msg.station, notes: msg.notes ?? "",
      };
      const i = fuel.findIndex((f) => f.id === entry.id);
      if (i >= 0) fuel[i] = entry; else fuel.push(entry);
      notify();
      return delay({ saved: true, warnings, entry });
    }
    case "vehicle_log/fuel/delete":
      fuel.splice(fuel.findIndex((f) => f.id === msg.entry_id), 1);
      notify();
      return delay(null);
    case "vehicle_log/expense/list": {
      let items = [...expenses].sort(byDateDesc);
      if (msg.start) items = items.filter((e) => e.date >= msg.start);
      if (msg.end) items = items.filter((e) => e.date <= msg.end);
      if (msg.category_ids) items = items.filter((e) => msg.category_ids.includes(e.category_id));
      if (msg.min_amount !== undefined) items = items.filter((e) => e.amount >= msg.min_amount);
      if (msg.max_amount !== undefined) items = items.filter((e) => e.amount <= msg.max_amount);
      return delay({
        total: items.length, sum: items.reduce((s, e) => s + e.amount, 0),
        items: items.slice(msg.offset ?? 0, (msg.offset ?? 0) + (msg.limit ?? 50)),
      });
    }
    case "vehicle_log/expense/save": {
      const entry = {
        id: msg.expense_id ?? `e${seq++}`, date: msg.date, odometer: msg.odometer,
        amount: msg.amount, category_id: msg.category_id, description: msg.description, attachment: null,
      };
      const i = expenses.findIndex((e) => e.id === entry.id);
      if (i >= 0) expenses[i] = entry; else expenses.push(entry);
      notify();
      return delay(entry);
    }
    case "vehicle_log/expense/delete":
      expenses.splice(expenses.findIndex((e) => e.id === msg.expense_id), 1);
      notify();
      return delay(null);
    case "vehicle_log/reminders":
      return delay(reminders);
    case "vehicle_log/reminder/save": {
      const r = { ...(reminders.find((x) => x.id === msg.reminder_id) ?? {}), ...msg,
        id: msg.reminder_id ?? `r${seq++}`, active: true, state: "ok", days_left: 100,
        distance_left: null, criterion: null,
        recurring: Boolean(msg.interval_days || msg.interval_distance) };
      reminders = reminders.filter((x) => x.id !== r.id).concat(r);
      notify();
      return delay(r);
    }
    case "vehicle_log/reminder/delete":
      reminders = reminders.filter((x) => x.id !== msg.reminder_id);
      notify();
      return delay(null);
    case "vehicle_log/reminder/done": {
      const r = reminders.find((x) => x.id === msg.reminder_id);
      Object.assign(r, r.recurring ? { state: "ok", days_left: 365, distance_left: 15000 }
        : { state: "inactive", active: false });
      notify();
      return delay(r);
    }
    case "vehicle_log/stats": {
      const short = msg.period === "30d";
      return delay({
        start: short ? "2026-02-24" : "2025-03-26", end: "2026-03-25", days: short ? 30 : 365,
        distance: short ? 514.29 : 2300, fuel_volume: { gasoline: short ? 62 : 175.5 },
        consumption: { gasoline: short ? 7.0 : 5.775 }, fuel_cost: short ? 109.5 : 317.1,
        expense_cost: short ? 312.6 : 448, total_cost: short ? 422.1 : 765.1,
        cost_per_distance: short ? 0.8207 : 0.3327, fuel_cost_per_distance: 0.1379,
        expenses_by_category: short ? { insurance: 300, toll: 8, parking: 4.6 }
          : { insurance: 300, maintenance: 120, toll: 23.4, parking: 4.6 },
        fill_count: short ? 2 : 6, expense_count: short ? 3 : 5, moving_average_window: 5,
        series: { gasoline: short ? series.slice(2) : series },
      });
    }
    case "auth/sign_path":
      return delay({ path: msg.path });
    default:
      throw new Error(`Commande inconnue : ${msg.type}`);
  }
}

let language = "fr";
const makeHass = () => ({
  language,
  locale: { language },
  callWS,
  fetchWithAuth: async (path) => {
    if (path.includes("/import/")) {
      const body = path.includes("apply=1")
        ? { added: 2, counts: { new: 2, duplicate: 1, error: 1 } }
        : {
            kind: "expenses", counts: { new: 2, duplicate: 1, error: 1 },
            new_categories: ["Lavage"], truncated: false,
            lines: [
              { line: 4, status: "error", message: "amount manquant", values: null },
              { line: 2, status: "new", message: null,
                values: { date: "2026-04-01", amount: 12.5, category_id: "x", description: "Lavage auto" } },
              { line: 3, status: "new", message: null,
                values: { date: "2026-04-03", amount: 8, category_id: "toll", description: "" } },
              { line: 5, status: "duplicate", message: null,
                values: { date: "2026-03-15", amount: 8, category_id: "toll", description: "" } },
            ],
          };
      return new Response(JSON.stringify(body), { status: 200 });
    }
    return new Response("{}", { status: 200 });
  },
  connection: {
    subscribeMessage: async (cb) => {
      listeners.add(cb);
      return async () => listeners.delete(cb);
    },
  },
});

await import("../../custom_components/vehicle_log/www/vehicle-log-cards.js");

const container = document.getElementById("cards");
const cards = ["vehicle-log-card", "vehicle-log-stats-card", "vehicle-log-journal-card"].map((type) => {
  const card = document.createElement(type);
  card.setConfig({ type: `custom:${type}` });
  card.hass = makeHass();
  container.append(card);
  return card;
});

document.getElementById("theme").addEventListener("click", () => {
  const root = document.documentElement;
  root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
});
document.getElementById("lang").addEventListener("click", () => {
  language = language === "fr" ? "en" : "fr";
  for (const card of cards) card.hass = makeHass();
});
window.vlCards = cards;
