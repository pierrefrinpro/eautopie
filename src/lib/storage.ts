/**
 * Accès au LocalStorage pour EauTopie.
 * Toutes les fonctions sont sûres côté SSR (vérifient la présence de window)
 * et tolèrent un LocalStorage indisponible (navigation privée, quota, etc.).
 */

const VOLUME_KEY = 'eautopie:volume';
const MESURES_CHLORE_KEY = 'eautopie:mesures:chlore';

export interface MesureChlore {
  /** Date ISO de la mesure */
  date: string;
  /** Volume du bassin en m³ */
  volume: number;
  /** Chlore mesuré en mg/L */
  chloreActuel: number;
  /** Chlore visé en mg/L */
  chloreCible: number;
  /** Grammes de chlore granulé recommandés */
  grammes: number;
}

function disponible(): boolean {
  try {
    return typeof window !== 'undefined' && !!window.localStorage;
  } catch {
    return false;
  }
}

/** Récupère le dernier volume saisi (ou null). */
export function getVolume(): number | null {
  if (!disponible()) return null;
  try {
    const v = window.localStorage.getItem(VOLUME_KEY);
    if (v === null) return null;
    const n = parseFloat(v);
    return Number.isFinite(n) ? n : null;
  } catch {
    return null;
  }
}

/** Mémorise le volume du bassin pour les prochaines visites. */
export function setVolume(volume: number): void {
  if (!disponible()) return;
  try {
    window.localStorage.setItem(VOLUME_KEY, String(volume));
  } catch {
    /* silencieux */
  }
}

/** Récupère l'historique des mesures de chlore (plus récente en premier). */
export function getMesuresChlore(): MesureChlore[] {
  if (!disponible()) return [];
  try {
    const raw = window.localStorage.getItem(MESURES_CHLORE_KEY);
    if (!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? (data as MesureChlore[]) : [];
  } catch {
    return [];
  }
}

/** Ajoute une mesure en tête d'historique (on conserve les 50 dernières). */
export function ajouterMesureChlore(mesure: MesureChlore): MesureChlore[] {
  const mesures = [mesure, ...getMesuresChlore()].slice(0, 50);
  if (disponible()) {
    try {
      window.localStorage.setItem(MESURES_CHLORE_KEY, JSON.stringify(mesures));
    } catch {
      /* silencieux */
    }
  }
  return mesures;
}
