/**
 * Moteur de diagnostic guidé — cas « eau verte ».
 *
 * Le but : à partir de quelques réponses + le volume du bassin, produire un
 * PLAN D'ACTION ordonné avec des quantités RÉELLES (calculées), des durées et
 * le « pourquoi » de chaque geste.
 *
 * ⚠️ Les dosages sont des ordres de grandeur courants pour des produits piscine
 * grand public. Ils sont volontairement prudents et accompagnés d'un rappel de
 * vérifier l'étiquette du produit (les concentrations varient selon les marques).
 */

// --- Types ----------------------------------------------------------------

export type Intensite = 'legere' | 'forte' | 'extreme';
export type OuiNonInconnu = 'oui' | 'non' | 'inconnu';
export type TypeFiltre = 'sable' | 'cartouche' | 'inconnu';
export type Contexte = 'hivernage' | 'saison';

export interface ReponsesEauVerte {
  contexte: Contexte;
  intensite: Intensite;
  parois: OuiNonInconnu; // parois glissantes / vertes = algues accrochées
  filtration: OuiNonInconnu;
  typeFiltre: TypeFiltre;
}

export interface OptionQuestion {
  valeur: string;
  label: string;
  detail?: string;
  emoji?: string;
}

export interface QuestionDiagnostic {
  id: keyof ReponsesEauVerte;
  question: string;
  aide?: string;
  options: OptionQuestion[];
}

export interface EtapePlan {
  id: string;
  titre: string;
  pourquoi: string;
  comment: string;
  duree?: string;
  cle?: boolean; // étape « clé » à mettre en avant
  lien?: { href: string; label: string };
}

// --- Questions ------------------------------------------------------------

export const QUESTIONS_EAU_VERTE: QuestionDiagnostic[] = [
  {
    id: 'contexte',
    question: 'Dans quelle situation es-tu ?',
    aide: 'Ça change tout : une remise en route après l’hiver demande un traitement bien plus costaud.',
    options: [
      {
        valeur: 'hivernage',
        emoji: '❄️',
        label: 'Sortie d’hivernage',
        detail: 'Pas (ou peu) entretenue depuis des mois, je la redémarre.',
      },
      {
        valeur: 'saison',
        emoji: '☀️',
        label: 'En pleine saison',
        detail: 'Je l’entretiens normalement, mais l’eau a viré récemment.',
      },
    ],
  },
  {
    id: 'intensite',
    question: 'À quel point l’eau est-elle verte ?',
    options: [
      {
        valeur: 'legere',
        emoji: '🟢',
        label: 'Légèrement verte',
        detail: 'Teintée mais translucide, on voit encore le fond.',
      },
      {
        valeur: 'forte',
        emoji: '🟩',
        label: 'Bien verte',
        detail: 'On ne voit plus le fond.',
      },
      {
        valeur: 'extreme',
        emoji: '🟫',
        label: 'Vert foncé / marron',
        detail: 'Eau opaque, presque une mare.',
      },
    ],
  },
  {
    id: 'parois',
    question: 'Les parois et le fond sont-ils glissants ou verts ?',
    aide: 'Des parois glissantes = des algues bien accrochées, qu’il faut décoller.',
    options: [
      { valeur: 'oui', emoji: '🟢', label: 'Oui, c’est glissant / vert' },
      { valeur: 'non', emoji: '✋', label: 'Non, les parois sont propres' },
      { valeur: 'inconnu', emoji: '🤷', label: 'Je ne sais pas' },
    ],
  },
  {
    id: 'filtration',
    question: 'Ta filtration fonctionne-t-elle ?',
    aide: 'La filtration est ton meilleur allié : sans elle, aucun traitement ne tiendra.',
    options: [
      { valeur: 'oui', emoji: '✅', label: 'Oui, elle tourne' },
      { valeur: 'non', emoji: '⚠️', label: 'Non / je ne l’ai pas lancée' },
      { valeur: 'inconnu', emoji: '🤷', label: 'Je ne sais pas' },
    ],
  },
  {
    id: 'typeFiltre',
    question: 'Quel type de filtre as-tu ?',
    aide: 'Utile pour savoir si un floculant est adapté (réservé aux filtres à sable).',
    options: [
      { valeur: 'sable', emoji: '⏳', label: 'Filtre à sable' },
      { valeur: 'cartouche', emoji: '🧻', label: 'Filtre à cartouche' },
      { valeur: 'inconnu', emoji: '🤷', label: 'Je ne sais pas' },
    ],
  },
];

// --- Dosages (calculés au volume) ----------------------------------------

const CHLORE_CHOC_G_PAR_M3: Record<Intensite, number> = {
  legere: 15,
  forte: 20,
  extreme: 25,
};

/** Chlore choc en grammes selon l'intensité du verdissement. */
export function doseChloreChoc(volume: number, intensite: Intensite): number {
  return Math.round(volume * CHLORE_CHOC_G_PAR_M3[intensite]);
}

/** Anti-algues curatif en millilitres (ordre de grandeur courant). */
export function doseAntiAlgues(volume: number): number {
  // ~15 ml/m³ en traitement curatif (varie selon le produit).
  return Math.round(volume * 15);
}

/** Floculant liquide en millilitres (filtres à sable uniquement). */
export function doseFloculant(volume: number): number {
  // ~10 ml/m³ (varie selon le produit).
  return Math.round(volume * 10);
}

// --- Génération du plan ---------------------------------------------------

const fmtG = (g: number) => `${g.toLocaleString('fr-FR')} g`;
const fmtMl = (ml: number) =>
  ml >= 1000
    ? `${(ml / 1000).toLocaleString('fr-FR', { maximumFractionDigits: 1 })} L`
    : `${ml} ml`;

/**
 * Construit le plan de traitement ordonné pour une eau verte.
 * @param rep réponses au questionnaire
 * @param volume volume du bassin en m³
 */
export function genererPlanEauVerte(
  rep: ReponsesEauVerte,
  volume: number
): EtapePlan[] {
  const etapes: EtapePlan[] = [];
  const fortOuPire = rep.intensite !== 'legere';
  const algues = rep.parois === 'oui' || fortOuPire;

  // 0. Filtration d'abord si elle ne tourne pas — bloquant
  if (rep.filtration !== 'oui') {
    etapes.push({
      id: 'filtration',
      titre: 'Mets la filtration en route',
      pourquoi:
        'Sans filtration, le traitement ne circule pas et l’eau ne s’éclaircira jamais. C’est la base.',
      comment:
        'Vérifie la pompe, amorce-la si besoin, et lance la filtration. Elle devra tourner en continu pendant tout le traitement.',
      cle: true,
    });
  }

  // 1. Nettoyage mécanique
  etapes.push({
    id: 'nettoyage',
    titre: 'Retire un maximum de saletés',
    pourquoi:
      'Moins il reste de débris et d’algues, plus le chlore se concentre sur l’eau au lieu de “s’épuiser” sur les déchets.',
    comment:
      rep.contexte === 'hivernage'
        ? 'Passe l’épuisette (feuilles, gros débris), puis brosse énergiquement parois et fond pour décoller le voile vert.'
        : 'Passe l’épuisette et brosse les parois et le fond.',
    duree: '15–30 min',
  });

  // 2. Équilibrer le pH avant le choc
  etapes.push({
    id: 'ph',
    titre: 'Règle le pH entre 7,0 et 7,2',
    pourquoi:
      'Le chlore est beaucoup plus efficace quand le pH est légèrement bas. À pH trop haut, tu gaspilles ton chlore choc.',
    comment:
      'Teste le pH. S’il est au-dessus de 7,2, ajoute du pH− (réducteur) avant de chlorer. Re-teste après 1–2 h de filtration.',
    duree: '~2 h (avec circulation)',
  });

  // 3. Chlore choc — l'étape clé
  const gChoc = doseChloreChoc(volume, rep.intensite);
  etapes.push({
    id: 'chlore-choc',
    titre: `Chlore choc : ${fmtG(gChoc)}`,
    pourquoi:
      'C’est le cœur du traitement : une grosse dose de chlore qui détruit les algues d’un coup.',
    comment:
      `Pour tes ${volume.toLocaleString('fr-FR')} m³, dilue environ ${fmtG(gChoc)} de chlore choc dans un seau d’eau, ` +
      'puis verse-le devant les refoulements, filtration en marche, de préférence le soir (le soleil détruit le chlore).',
    duree: 'Agit en 12–24 h',
    cle: true,
  });

  // 4. Anti-algues si algues accrochées / eau bien verte
  if (algues) {
    const mlAlg = doseAntiAlgues(volume);
    etapes.push({
      id: 'anti-algues',
      titre: `Anti-algues : ${fmtMl(mlAlg)}`,
      pourquoi:
        'L’anti-algues empêche les algues survivantes de repartir dès que le chlore retombe. Indispensable quand elles sont bien installées.',
      comment:
        `Compte environ ${fmtMl(mlAlg)} pour ${volume.toLocaleString('fr-FR')} m³, à ajouter ` +
        'quelques heures après le chlore choc, filtration en marche. (Vérifie la dose sur ton bidon.)',
    });
  }

  // 5. Filtration en continu
  etapes.push({
    id: 'filtration-continue',
    titre: 'Laisse filtrer en continu',
    pourquoi:
      'C’est la filtration qui va capturer les algues mortes et rendre l’eau claire. Le chlore tue, le filtre nettoie.',
    comment:
      rep.intensite === 'extreme'
        ? 'Filtration NON-STOP pendant 48 à 72 h.'
        : fortOuPire
          ? 'Filtration NON-STOP pendant 24 à 48 h.'
          : 'Filtration en continu pendant 12 à 24 h.',
    cle: true,
  });

  // 6. Floculant si filtre à sable et eau encore laiteuse
  if (rep.typeFiltre === 'sable' && fortOuPire) {
    const mlFloc = doseFloculant(volume);
    etapes.push({
      id: 'floculant',
      titre: `Si l’eau reste laiteuse : floculant (${fmtMl(mlFloc)})`,
      pourquoi:
        'Le floculant agglomère les fines particules pour que ton filtre à sable puisse les retenir. Ça finit le travail d’éclaircissement.',
      comment:
        `Seulement après le chlore choc, si l’eau est blanchâtre : environ ${fmtMl(mlFloc)} pour ${volume.toLocaleString('fr-FR')} m³. ` +
        '⚠️ À réserver aux filtres à sable (jamais sur cartouche).',
    });
  }

  // 7. Nettoyer le filtre
  etapes.push({
    id: 'nettoyage-filtre',
    titre: 'Nettoie ton filtre',
    pourquoi:
      'Après avoir avalé toutes ces algues, ton filtre est encrassé : il faut le purger pour qu’il reste efficace.',
    comment:
      rep.typeFiltre === 'cartouche'
        ? 'Sors la cartouche et rince-la au jet (remplace-la si elle est trop colmatée).'
        : rep.typeFiltre === 'sable'
          ? 'Fais un contre-lavage (backwash) puis un rinçage de ton filtre à sable.'
          : 'Nettoie ton filtre (contre-lavage pour le sable, rinçage pour la cartouche).',
    duree: '5–10 min',
  });

  // 8. Re-test et retour à la normale
  etapes.push({
    id: 'retour-normale',
    titre: 'Re-teste et reviens à un entretien normal',
    pourquoi:
      'Une fois l’eau claire, il faut stabiliser : ramener le chlore à un niveau d’entretien et vérifier l’équilibre.',
    comment:
      'Quand l’eau est redevenue claire, attends que le chlore redescende sous 3 mg/L avant de te baigner. ' +
      'Ajuste ensuite ton chlore d’entretien (0,5–1,5 mg/L) et surveille le pH.',
    lien: { href: '/calculateur/chlore', label: 'Calculer mon chlore d’entretien' },
  });

  return etapes;
}

// --- Planning des 5 prochains jours (preview gratuite) --------------------

export interface JourPlanning {
  /** Décalage en jours par rapport à aujourd'hui (0 = aujourd'hui). */
  offset: number;
  /** Intitulé court de la journée. */
  phase: string;
  /** Liste des tâches du jour. */
  taches: string[];
}

/**
 * Construit un planning jour par jour (5 jours) pour récupérer l'eau verte.
 * S'adapte à l'intensité, aux algues et au type de filtre.
 */
export function genererPlanning5Jours(
  rep: ReponsesEauVerte,
  volume: number
): JourPlanning[] {
  const fortOuPire = rep.intensite !== 'legere';
  const algues = rep.parois === 'oui' || fortOuPire;
  const gChoc = doseChloreChoc(volume, rep.intensite);

  const j0: string[] = [
    'Retire les gros débris (épuisette) et brosse parois + fond',
    'Règle le pH entre 7,0 et 7,2',
    `Le soir : verse le chlore choc (${fmtG(gChoc)}), filtration en marche`,
    'Laisse filtrer toute la nuit',
  ];

  const j1: string[] = ['Garde la filtration en continu'];
  if (algues) j1.push(`Ajoute l'anti-algues (${fmtMl(doseAntiAlgues(volume))})`);
  j1.push('Re-brosse les parois');
  j1.push('L’eau vire du vert au gris/blanc ? C’est bon signe : les algues meurent');

  const j2: string[] = [];
  if (rep.typeFiltre === 'sable' && fortOuPire)
    j2.push(`Si l'eau est laiteuse : floculant (${fmtMl(doseFloculant(volume))}) le soir`);
  j2.push('Nettoie le panier du skimmer et la préfiltration');
  j2.push('Continue la filtration');

  const j3: string[] = [
    'Teste le chlore et le pH, ajuste si besoin',
    'Passe l’aspirateur au fond (dépôts d’algues mortes)',
    rep.typeFiltre === 'cartouche'
      ? 'Rince la cartouche du filtre'
      : 'Fais un contre-lavage du filtre à sable',
  ];

  const j4: string[] = [
    'Normalement, l’eau est claire 🎉',
    'Ramène le chlore à un niveau d’entretien (0,5–1,5 mg/L)',
    'Baignade OK dès que le chlore repasse sous 3 mg/L',
  ];

  return [
    { offset: 0, phase: 'Le traitement choc', taches: j0 },
    { offset: 1, phase: 'On laisse agir', taches: j1 },
    { offset: 2, phase: 'On clarifie', taches: j2 },
    { offset: 3, phase: 'Contrôle', taches: j3 },
    { offset: 4, phase: 'Retour à la normale', taches: j4 },
  ];
}

/** Petit résumé/titre du diagnostic, affiché en haut du plan. */
export function resumeDiagnostic(rep: ReponsesEauVerte): {
  titre: string;
  sousTitre: string;
} {
  if (rep.contexte === 'hivernage') {
    return {
      titre: 'Remise en route après hivernage',
      sousTitre:
        'Ta piscine a besoin d’un traitement complet. Suis le plan dans l’ordre, sans sauter d’étape.',
    };
  }
  const map: Record<Intensite, string> = {
    legere: 'Eau légèrement verte — rattrapage rapide',
    forte: 'Eau verte — traitement choc',
    extreme: 'Eau très verte — traitement choc renforcé',
  };
  return {
    titre: map[rep.intensite],
    sousTitre:
      'Voici ton plan d’action personnalisé, calculé pour ta piscine. Suis-le dans l’ordre.',
  };
}
