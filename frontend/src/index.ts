// Point d'entrée : déclaration des éléments et des cartes auprès de Lovelace.
import { VehicleLogCard } from "./cards/dashboard-card";
import { VehicleLogCardEditor } from "./cards/editor";
import { VehicleLogJournalCard } from "./cards/journal-card";
import { VehicleLogStatsCard } from "./cards/stats-card";
import { VlConfirmDialog } from "./components/confirm-dialog";
import { VlConsumptionChart } from "./components/consumption-chart";
import { VlExpenseDialog } from "./components/expense-dialog";
import { VlFuelDialog } from "./components/fuel-dialog";
import { VlMonthlyChart } from "./components/monthly-chart";
import { VlReminderDialog } from "./components/reminder-dialog";
import { VlReminderList } from "./components/reminder-list";
import { t } from "./i18n";
import type { HomeAssistant } from "./types";

const elements: Record<string, CustomElementConstructor> = {
  "vehicle-log-card": VehicleLogCard,
  "vehicle-log-journal-card": VehicleLogJournalCard,
  "vehicle-log-stats-card": VehicleLogStatsCard,
  "vehicle-log-card-editor": VehicleLogCardEditor,
  "vl-fuel-dialog": VlFuelDialog,
  "vl-expense-dialog": VlExpenseDialog,
  "vl-confirm-dialog": VlConfirmDialog,
  "vl-monthly-chart": VlMonthlyChart,
  "vl-consumption-chart": VlConsumptionChart,
  "vl-reminder-dialog": VlReminderDialog,
  "vl-reminder-list": VlReminderList,
};

for (const [name, ctor] of Object.entries(elements)) {
  if (!customElements.get(name)) customElements.define(name, ctor);
}

interface CustomCardInfo {
  type: string;
  name: string;
  description: string;
  preview?: boolean;
  documentationURL?: string;
}

declare global {
  interface Window {
    customCards?: CustomCardInfo[];
  }
}

// Langue du navigateur pour le sélecteur de cartes (hass n'est pas encore connu).
const hass = { language: navigator.language } as HomeAssistant;
window.customCards = window.customCards ?? [];
for (const card of [
  {
    type: "vehicle-log-card",
    name: t(hass, "card.name"),
    description: t(hass, "card.description"),
  },
  {
    type: "vehicle-log-journal-card",
    name: t(hass, "journal.name"),
    description: t(hass, "journal.description"),
  },
  {
    type: "vehicle-log-stats-card",
    name: t(hass, "stats.name"),
    description: t(hass, "stats.description"),
  },
]) {
  if (!window.customCards.some((c) => c.type === card.type)) {
    window.customCards.push({ ...card, preview: true });
  }
}
