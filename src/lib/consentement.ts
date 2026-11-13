// Choix du visiteur sur les cookies de mesure d'audience.
// Le choix est gardé 6 mois, puis le bandeau est proposé à nouveau
// (durée recommandée par la CNIL pour conserver un choix).
// Format stocké : « granted|1763049600000 » ou « denied|1763049600000 ».
// Une ancienne valeur sans date (« granted » seul) compte comme expirée.

const CLE = 'eautopie_cookie_consent';
const DUREE_MS = 182 * 24 * 60 * 60 * 1000;

export type Choix = 'granted' | 'denied';

export function lireConsentement(): Choix | null {
  try {
    const brut = window.localStorage.getItem(CLE);
    if (!brut) return null;
    const [choix, date] = brut.split('|');
    const t = Number(date);
    if (!t || Date.now() - t > DUREE_MS) return null;
    return choix === 'granted' || choix === 'denied' ? choix : null;
  } catch {
    return null;
  }
}

export function enregistrerConsentement(choix: Choix): void {
  try {
    window.localStorage.setItem(CLE, `${choix}|${Date.now()}`);
  } catch {
    /* stockage indisponible : le bandeau reviendra à la prochaine visite */
  }
}

export function consentementAccorde(): boolean {
  return lireConsentement() === 'granted';
}
