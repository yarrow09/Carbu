import { money, num } from "../format";
import { t, type Key } from "../i18n";
import type { CoherenceWarning, FuelType, HomeAssistant, VehicleView } from "../types";

/** Message traduit d'un avertissement de cohérence. */
export function formatWarning(
  hass: HomeAssistant,
  warning: CoherenceWarning,
  vehicle: VehicleView,
  fuel: FuelType,
  currency: string,
): string {
  const d = warning.details;
  const n = (key: string, digits: number) =>
    typeof d[key] === "number" ? num(hass, d[key] as number, digits) : String(d[key] ?? "");
  const key = `warning.${warning.code}` as Key;
  return t(hass, key, {
    previous: n("previous", 0),
    next: n("next", 0),
    value: n("value", 2),
    min: n("min", 1),
    max: n("max", 1),
    capacity: n("capacity", 1),
    expected: typeof d.expected === "number" ? money(hass, d.expected, currency) : "",
    unit: vehicle.units.distance,
    volume: vehicle.units.volume[fuel] ?? "L",
    consumption: vehicle.units.consumption[fuel] ?? "",
  });
}
