/**
 * Calculateur de chlore d'entretien.
 * Objectif : maintenir 0.5 - 1.5 mg/L de chlore libre.
 *
 * @param volume - volume du bassin en m³
 * @param chloreActuel - mesure utilisateur en mg/L (via bandelette)
 * @param chloreCible - cible par défaut 1 mg/L
 * @returns grammes de chlore granulé à ajouter (chlore stabilisé ~65%)
 */
export function calculerChloreEntretien(
  volume: number,
  chloreActuel: number,
  chloreCible: number = 1
): number {
  if (chloreActuel >= chloreCible) return 0;
  const deficitMgL = chloreCible - chloreActuel;
  const grammesNecessaires = volume * deficitMgL * 1.54;
  return Math.round(grammesNecessaires);
}

/**
 * Volume d'un bassin rectangulaire / ovale approximé.
 * @param longueur - en mètres
 * @param largeur - en mètres
 * @param profondeurMoyenne - en mètres
 * @returns volume en m³ (arrondi à 0.1)
 */
export function volumeRectangulaire(
  longueur: number,
  largeur: number,
  profondeurMoyenne: number
): number {
  return arrondir1(longueur * largeur * profondeurMoyenne);
}

/**
 * Volume d'un bassin rond.
 * Formule : diamètre² × profondeur × 0.785 (≈ π/4).
 * @param diametre - en mètres
 * @param profondeur - en mètres
 * @returns volume en m³ (arrondi à 0.1)
 */
export function volumeRond(diametre: number, profondeur: number): number {
  return arrondir1(diametre * diametre * profondeur * 0.785);
}

function arrondir1(n: number): number {
  return Math.round(n * 10) / 10;
}
