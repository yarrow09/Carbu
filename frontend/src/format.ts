// Mise en forme localisée (nombres, montants, dates).
import { language } from "./i18n";
import type { FuelGrade, HomeAssistant } from "./types";

export function num(
  hass: HomeAssistant | undefined,
  value: number | null | undefined,
  digits = 0,
): string {
  if (value === null || value === undefined || Number.isNaN(value)) return "—";
  return new Intl.NumberFormat(language(hass), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function money(
  hass: HomeAssistant | undefined,
  value: number | null | undefined,
  currency: string,
  digits = 2,
): string {
  if (value === null || value === undefined) return "—";
  try {
    return new Intl.NumberFormat(language(hass), {
      style: "currency",
      currency,
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value);
  } catch {
    return `${num(hass, value, digits)} ${currency}`;
  }
}

export function shortDate(hass: HomeAssistant | undefined, iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Intl.DateTimeFormat(language(hass), { dateStyle: "medium" }).format(
    new Date(y, m - 1, d),
  );
}

export function monthLabel(hass: HomeAssistant | undefined, key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Intl.DateTimeFormat(language(hass), { month: "short" }).format(
    new Date(y, m - 1, 1),
  );
}

export function longMonthLabel(hass: HomeAssistant | undefined, key: string): string {
  const [y, m] = key.split("-").map(Number);
  return new Intl.DateTimeFormat(language(hass), { month: "long", year: "numeric" }).format(
    new Date(y, m - 1, 1),
  );
}

/** Date locale du jour au format AAAA-MM-JJ. */
export function todayIso(offsetDays = 0): string {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return isoDate(d);
}

export function isoDate(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/** Arrondi décimal sûr (évite 0.1 + 0.2). */
export function round(value: number, digits: number): number {
  const f = 10 ** digits;
  return Math.round((value + Number.EPSILON) * f) / f;
}

/** Lecture d'un champ numérique (virgule décimale acceptée). */
export function parseNumber(raw: string): number | null {
  const cleaned = raw.trim().replace(/\s/g, "").replace(",", ".");
  if (cleaned === "") return null;
  const value = Number(cleaned);
  return Number.isFinite(value) ? value : null;
}

/** Valeur à afficher dans un champ de saisie (séparateur décimal local, sans espaces). */
export function inputNumber(hass: HomeAssistant | undefined, value: number, digits: number): string {
  const text = String(round(value, digits));
  const decimal = new Intl.NumberFormat(language(hass)).format(1.5).charAt(1);
  return decimal === "," ? text.replace(".", ",") : text;
}

/** Qualités d'essence, dans l'ordre d'affichage. */
export const GRADES: FuelGrade[] = ["e10", "sp95", "sp98"];

/** Libellé à la pompe d'une qualité d'essence. */
export function gradeLabel(grade: FuelGrade | null | undefined): string {
  if (!grade) return "";
  return { e10: "SP95-E10", sp95: "SP95", sp98: "SP98" }[grade];
}

/** Masse de CO2e lisible : kg sous une tonne, t au-delà. */
export function co2Mass(hass: HomeAssistant | undefined, kg: number | null | undefined): {
  value: string;
  unit: string;
} {
  if (kg === null || kg === undefined) return { value: "—", unit: "kg CO₂e" };
  if (Math.abs(kg) >= 1000) return { value: num(hass, kg / 1000, 2), unit: "t CO₂e" };
  return { value: num(hass, kg, 0), unit: "kg CO₂e" };
}
