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

/**
 * Chlore choc : grammes à ajouter selon le dosage par m³ choisi.
 * @param volume - volume du bassin en m³
 * @param gParM3 - dose en g/m³ (15 léger, 20 fort, 25 très fort)
 */
export function calculerChloreChoc(volume: number, gParM3: number): number {
  return Math.round(volume * gParM3);
}

export type SensPh = 'baisser' | 'monter' | 'ok';

export interface CorrectionPh {
  sens: SensPh;
  grammes: number;
  produit: '' | 'pH−' | 'pH+';
}

/**
 * Correction du pH : indique s'il faut monter/baisser et la dose indicative.
 *
 * ⚠️ Estimation de DÉPART : la dose réelle dépend fortement de l'alcalinité (TAC)
 * et de la concentration du produit. On conseille toujours de verser la moitié,
 * re-tester après 2-4 h de filtration, puis ajuster.
 *
 * @param volume - volume du bassin en m³
 * @param phActuel - pH mesuré
 * @param phCible - pH visé (idéal 7,2 - 7,4)
 */
export function calculerCorrectionPh(
  volume: number,
  phActuel: number,
  phCible: number
): CorrectionPh {
  const delta = phCible - phActuel;
  if (Math.abs(delta) < 0.05) return { sens: 'ok', grammes: 0, produit: '' };

  // ~8 g/m³ pour décaler le pH de 0,1 (ordre de grandeur, produit granulé).
  const grammes = Math.round((volume * (Math.abs(delta) / 0.1) * 8) / 5) * 5;

  return delta < 0
    ? { sens: 'baisser', grammes, produit: 'pH−' }
    : { sens: 'monter', grammes, produit: 'pH+' };
}

/**
 * Stabilisant (acide cyanurique) à ajouter pour atteindre la cible.
 * 1 g/m³ ≈ +1 mg/L. On ne peut pas le faire baisser (sauf renouvellement d'eau).
 */
export function calculerStabilisant(
  volume: number,
  actuel: number,
  cible: number
): number {
  if (cible <= actuel) return 0;
  return Math.round(volume * (cible - actuel));
}

/**
 * Sel à ajouter (piscine au sel / électrolyseur), en kg.
 * 1 g/L × 1 m³ = 1 kg. cible et actuel en g/L (souvent 3 à 5 g/L).
 */
export function calculerSel(
  volume: number,
  actuelGparL: number,
  cibleGparL: number
): number {
  if (cibleGparL <= actuelGparL) return 0;
  return Math.round(volume * (cibleGparL - actuelGparL) * 10) / 10;
}

/** Anti-algues en ml selon le mode (préventif ~5 ml/m³, curatif ~15 ml/m³). */
export function calculerAntiAlgues(
  volume: number,
  mode: 'preventif' | 'curatif'
): number {
  return Math.round(volume * (mode === 'curatif' ? 15 : 5));
}

/** Floculant liquide en ml (~10 ml/m³, filtres à sable uniquement). */
export function calculerFloculant(volume: number): number {
  return Math.round(volume * 10);
}

/**
 * TAC / alcalinité : bicarbonate de soude à ajouter pour monter le TAC.
 * ~1,7 g/m³ pour +1 mg/L. Le faire baisser passe par le pH−/aération.
 */
export function calculerTac(
  volume: number,
  actuel: number,
  cible: number
): number {
  if (cible <= actuel) return 0;
  return Math.round(volume * (cible - actuel) * 1.7);
}
