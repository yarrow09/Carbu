// Préférences d'affichage retenues par le navigateur (véhicule, période, onglet).
// Le stockage peut être indisponible (navigation privée) : on s'en passe alors.

export function readPref(key: string): string | undefined {
  try {
    return window.localStorage.getItem(`carbu-${key}`) ?? undefined;
  } catch {
    return undefined;
  }
}

export function writePref(key: string, value: string): void {
  try {
    window.localStorage.setItem(`carbu-${key}`, value);
  } catch {
    // Stockage indisponible : le choix n'est pas retenu.
  }
}
