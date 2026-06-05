/**
 * Moteur de diagnostics guidés « légers » : une série de questions, chaque
 * réponse ajoute des points à une ou plusieurs causes, et on affiche la (ou les)
 * cause(s) la(es) plus probable(s) avec des conseils + liens.
 */

export interface OptionDiag {
  value: string;
  label: string;
  emoji?: string;
  causes?: Record<string, number>;
}
export interface QuestionDiag {
  id: string;
  question: string;
  aide?: string;
  options: OptionDiag[];
}
export interface CauseDiag {
  id: string;
  titre: string;
  conseil: string;
  liens?: { href: string; label: string }[];
}
export interface GuideDiag {
  slug: string;
  questions: QuestionDiag[];
  causes: CauseDiag[];
}

export const GUIDES: Record<string, GuideDiag> = {
  'eau-trouble': {
    slug: 'eau-trouble',
    questions: [
      {
        id: 'filtration',
        question: 'Ta filtration tourne-t-elle assez chaque jour ?',
        aide: 'En gros, la moitié de la température de l’eau, en heures.',
        options: [
          { value: 'oui', emoji: '✅', label: 'Oui, suffisamment' },
          { value: 'non', emoji: '⚠️', label: 'Non / trop peu', causes: { filtration: 3 } },
          { value: 'inconnu', emoji: '🤷', label: 'Je ne sais pas', causes: { filtration: 1 } },
        ],
      },
      {
        id: 'choc',
        question: 'As-tu fait un chlore choc dans les 2 derniers jours ?',
        options: [
          { value: 'oui', emoji: '💥', label: 'Oui, récemment', causes: { choc: 3 } },
          { value: 'non', emoji: '🚫', label: 'Non' },
        ],
      },
      {
        id: 'ph',
        question: 'Ton pH est-il au-dessus de 7,4 ?',
        options: [
          { value: 'oui', emoji: '⬆️', label: 'Oui, trop haut', causes: { ph: 3 } },
          { value: 'non', emoji: '✅', label: 'Non, il est bon' },
          { value: 'inconnu', emoji: '🤷', label: 'Pas testé', causes: { ph: 1 } },
        ],
      },
      {
        id: 'calcaire',
        question: 'Ton eau est-elle calcaire / dure (dépôts blancs) ?',
        options: [
          { value: 'oui', emoji: '🪨', label: 'Oui', causes: { calcaire: 2 } },
          { value: 'non', emoji: '🚫', label: 'Non' },
          { value: 'inconnu', emoji: '🤷', label: 'Je ne sais pas' },
        ],
      },
      {
        id: 'chlore',
        question: 'Ton taux de chlore est-il bas (sous 0,5 mg/L) ?',
        options: [
          { value: 'oui', emoji: '⚠️', label: 'Oui, bas', causes: { algues: 3 } },
          { value: 'non', emoji: '✅', label: 'Non, correct', causes: { particules: 1 } },
          { value: 'inconnu', emoji: '🤷', label: 'Pas testé' },
        ],
      },
    ],
    causes: [
      {
        id: 'filtration',
        titre: 'Une filtration insuffisante',
        conseil:
          'C’est la cause n°1. Augmente la durée de filtration (en continu le temps de récupérer) et vérifie que ton filtre n’est pas encrassé.',
        liens: [
          { href: '/blog/temps-filtration-piscine-calcul', label: 'Guide du temps de filtration' },
        ],
      },
      {
        id: 'ph',
        titre: 'Un pH déséquilibré',
        conseil:
          'Un pH trop haut rend l’eau trouble et fait précipiter le calcaire. Ramène-le entre 7,2 et 7,4.',
        liens: [{ href: '/calculateur/ph', label: 'Calculateur de pH' }],
      },
      {
        id: 'choc',
        titre: 'Un chlore choc récent',
        conseil:
          'Normal ! Ce sont souvent les algues mortes ou le calcaire remué. Laisse filtrer en continu 24 à 48 h, l’eau s’éclaircit toute seule.',
      },
      {
        id: 'calcaire',
        titre: 'Un excès de calcaire',
        conseil:
          'Vérifie ton pH et ton TAC, et utilise un séquestrant de calcaire si ton eau est dure.',
        liens: [{ href: '/calculateur/tac', label: 'Calculateur de TAC' }],
      },
      {
        id: 'algues',
        titre: 'Un début d’algues (chlore trop bas)',
        conseil:
          'Ton eau risque de virer au vert. Remonte le chlore sans tarder, et si ça verdit, passe au diagnostic eau verte.',
        liens: [
          { href: '/calculateur/chlore', label: 'Calculateur de chlore' },
          { href: '/diagnostic/eau-verte', label: 'Diagnostic eau verte' },
        ],
      },
      {
        id: 'particules',
        titre: 'De fines particules en suspension',
        conseil:
          'Trop fines pour le filtre. Un floculant (filtre à sable) ou un clarifiant (cartouche) les agglomère pour les capturer.',
        liens: [{ href: '/calculateur/floculant', label: 'Calculateur de floculant' }],
      },
    ],
  },

  'pique-aux-yeux': {
    slug: 'pique-aux-yeux',
    questions: [
      {
        id: 'ph',
        question: 'As-tu testé ton pH ? Est-il hors de la zone 7,2–7,4 ?',
        options: [
          { value: 'oui', emoji: '⬆️', label: 'Oui, hors zone', causes: { ph: 3 } },
          { value: 'non', emoji: '✅', label: 'Non, il est bon' },
          { value: 'inconnu', emoji: '🤷', label: 'Pas testé', causes: { ph: 2 } },
        ],
      },
      {
        id: 'odeur',
        question: 'Sens-tu une forte odeur de chlore ?',
        aide: 'L’odeur forte = chloramines, pas excès de chlore.',
        options: [
          { value: 'oui', emoji: '👃', label: 'Oui, ça sent fort', causes: { chloramines: 3 } },
          { value: 'non', emoji: '🚫', label: 'Non' },
        ],
      },
      {
        id: 'chlore',
        question: 'Ton chlore libre est-il bas (sous 0,5 mg/L) ?',
        options: [
          { value: 'oui', emoji: '⚠️', label: 'Oui, bas', causes: { chloramines: 2, chloreBas: 2 } },
          { value: 'non', emoji: '✅', label: 'Non, correct' },
          { value: 'inconnu', emoji: '🤷', label: 'Pas testé', causes: { chloramines: 1 } },
        ],
      },
      {
        id: 'frequentation',
        question: 'Beaucoup de baignade récemment (sueur, crème, urine) ?',
        options: [
          { value: 'oui', emoji: '🏊', label: 'Oui, forte fréquentation', causes: { chloramines: 2 } },
          { value: 'non', emoji: '🚫', label: 'Non' },
        ],
      },
    ],
    causes: [
      {
        id: 'chloramines',
        titre: 'Des chloramines (chlore combiné)',
        conseil:
          'C’est ce qui pique et sent fort — un signe de manque de chlore, pas d’excès. Fais un chlore choc pour les détruire.',
        liens: [
          { href: '/calculateur/chlore-choc', label: 'Calculateur de chlore choc' },
          { href: '/blog/eau-piscine-pique-aux-yeux', label: 'Comprendre les irritations' },
        ],
      },
      {
        id: 'ph',
        titre: 'Un pH déséquilibré',
        conseil:
          'Un pH hors de 7,2–7,4 irrite les yeux et la peau, même avec un chlore parfait. Rééquilibre-le.',
        liens: [{ href: '/calculateur/ph', label: 'Calculateur de pH' }],
      },
      {
        id: 'chloreBas',
        titre: 'Un manque de chlore libre',
        conseil:
          'Sans assez de chlore actif, les polluants s’accumulent et l’eau devient irritante. Remonte ton chlore.',
        liens: [{ href: '/calculateur/chlore', label: 'Calculateur de chlore' }],
      },
    ],
  },

  'taches-liner': {
    slug: 'taches-liner',
    questions: [
      {
        id: 'couleur',
        question: 'De quelle couleur sont les taches ?',
        options: [
          { value: 'verte', emoji: '🟢', label: 'Vertes / brunes', causes: { organique: 2 } },
          { value: 'noire', emoji: '⚫', label: 'Grises / noires', causes: { alguesNoires: 3 } },
          { value: 'blanche', emoji: '⚪', label: 'Blanches / rugueuses', causes: { calcaire: 3 } },
          { value: 'rouille', emoji: '🟠', label: 'Rouille / ocre', causes: { metaux: 3 } },
        ],
      },
      {
        id: 'toucher',
        question: 'Au toucher, c’est plutôt…',
        options: [
          { value: 'glissant', emoji: '🫧', label: 'Glissant / visqueux', causes: { alguesNoires: 2, organique: 1 } },
          { value: 'rugueux', emoji: '🪨', label: 'Rugueux / dur', causes: { calcaire: 2 } },
          { value: 'lisse', emoji: '✋', label: 'Lisse', causes: { metaux: 1 } },
        ],
      },
      {
        id: 'localisation',
        question: 'Où sont-elles surtout ?',
        options: [
          { value: 'fond', emoji: '⬇️', label: 'Au fond / zones mortes', causes: { organique: 1, alguesNoires: 1 } },
          { value: 'parois', emoji: '🧱', label: 'Sur les parois' },
          { value: 'partout', emoji: '🌐', label: 'Un peu partout', causes: { calcaire: 1 } },
        ],
      },
    ],
    causes: [
      {
        id: 'alguesNoires',
        titre: 'Des algues incrustées (noires)',
        conseil:
          'Brosse énergiquement la zone, applique un chlore choc (au plus près des taches, filtration coupée quelques minutes), puis un anti-algues.',
        liens: [
          { href: '/calculateur/chlore-choc', label: 'Calculateur de chlore choc' },
          { href: '/calculateur/anti-algues', label: 'Calculateur d’anti-algues' },
        ],
      },
      {
        id: 'calcaire',
        titre: 'Des dépôts de calcaire',
        conseil:
          'Baisse le pH et le TAC vers le bas de la fourchette, et utilise un séquestrant de calcaire. Brosse les dépôts.',
        liens: [
          { href: '/calculateur/ph', label: 'Calculateur de pH' },
          { href: '/calculateur/tac', label: 'Calculateur de TAC' },
        ],
      },
      {
        id: 'organique',
        titre: 'Des taches organiques (feuilles, tanins)',
        conseil:
          'Retire les débris, brosse, et fais un chlore choc. Évite de laisser des feuilles stagner au fond.',
        liens: [{ href: '/calculateur/chlore-choc', label: 'Calculateur de chlore choc' }],
      },
      {
        id: 'metaux',
        titre: 'Des taches de métaux (fer, cuivre)',
        conseil:
          'Souvent dû à une eau de remplissage chargée en métaux. Utilise un séquestrant de métaux et vérifie ta source d’eau.',
      },
    ],
  },
};

export function genererVerdict(
  guide: GuideDiag,
  reponses: Record<string, string>
): CauseDiag[] {
  const scores: Record<string, number> = {};
  for (const q of guide.questions) {
    const opt = q.options.find((o) => o.value === reponses[q.id]);
    if (opt?.causes) {
      for (const [c, p] of Object.entries(opt.causes)) {
        scores[c] = (scores[c] ?? 0) + p;
      }
    }
  }
  const classees = guide.causes
    .map((c) => ({ cause: c, score: scores[c.id] ?? 0 }))
    .sort((a, b) => b.score - a.score);
  const positives = classees.filter((r) => r.score > 0);
  if (positives.length === 0) return [guide.causes[0]];
  return positives.slice(0, 2).map((r) => r.cause);
}
