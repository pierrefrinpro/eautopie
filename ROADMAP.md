# Roadmap EauTopie

> Vision : EauTopie n'est pas « un calculateur de chlore ». C'est l'assistant
> complet qui accompagne un particulier sur **tous les cas réels** d'entretien
> de sa piscine — du dosage quotidien à la remise en route après l'hiver.

## ✅ Fait (MVP — jour 1)

- Projet Astro 4 + TypeScript + Tailwind (charte EauTopie) + polices.
- BaseLayout (SEO, Open Graph), Header, Footer.
- Page d'accueil (hero, 3 piliers, CTA blog).
- **Calculateur de chlore d'entretien** (LocalStorage, mini-calc volume).
- Déploiement Cloudflare + domaine eautopie.fr (chez Gandi).

## 🔜 Prochains calculateurs (`pages/calculateur/`)

> ⭐ **Priorité immédiate après le SEO/blog** : **Chlore choc** et **pH**.
> Une fois créés, il FAUT les brancher dans le diagnostic « eau verte » :
> l'étape « Chlore choc » du plan doit lier le calculateur de chlore choc, et
> l'étape « Règle le pH » doit lier le calculateur de pH (liens retirés pour
> l'instant pour ne pas tromper l'utilisateur).

- [ ] **Chlore choc** (eau qui a viré / forte fréquentation).
- [ ] **pH+ / pH−** (rééquilibrage du pH).
- [ ] **Stabilisant** (acide cyanurique).
- [ ] **Anti-algues** (dosage selon volume).
- [ ] **Floculant / clarifiant** (eau trouble).
- [ ] **TAC / dureté** (alcalinité, eau agressive ou entartrante).

## 🔬 Diagnostics guidés (`pages/diagnostic/`)

Parcours pas-à-pas qui posent des questions et orientent vers le bon traitement
+ les bons calculateurs.

- [ ] **Eau verte** — distinguer les cas :
  - Sortie d'hivernage / 0 entretien → **remise en route complète**
    (rééquilibrer pH + TAC, chlore choc, anti-algues, brossage/nettoyage,
    filtration en continu, floculant si besoin).
  - Eau verte « légère » en saison → chlore choc + anti-algues.
- [ ] **Eau trouble** (blanchâtre / laiteuse) → pH, filtration, floculant.
- [ ] **Ça pique aux yeux / odeur de chlore** → chloramines, pH, chlore choc.
- [ ] **Eau qui s'évapore / niveau** , **dépôts/tartre**, etc.

## 💧 Suivi de l'eau (« Suis ton eau »)

- [ ] Saisie régulière des paramètres (chlore, pH, TAC, température…).
- [ ] Affichage de l'historique + tendances.

## ⭐ Premium (~4,99 €/mois)

Ce qui justifie l'abonnement (au-delà des calculs, qui restent gratuits) :

- [ ] **Sauvegarde des données** (au-delà du LocalStorage : compte + backend,
      synchro multi-appareils, pas de perte si on change de téléphone).
- [ ] **Planning d'entretien personnalisé** (rappels intelligents : « teste ton
      eau », « ajoute du stabilisant », saisonnalité hivernage / remise en route).
- [ ] **Multi-piscines**.
- [ ] **Historique avancé** (graphes, export).
- [ ] **Dashboard connecté** : après paiement, l'utilisateur a un espace avec
      ses infos (volume, type de piscine), ses diagnostics passés, ses plannings
      et ses rappels.

### Levier de conversion (en cours de mise en place)

- [x] À la fin d'un diagnostic : **preview gratuite du planning des 5 prochains
      jours** (visible), puis **teaser verrouillé** du planning quotidien +
      hebdomadaire avec rappels → débloqué par le Premium.
- [ ] Brancher un vrai paiement (Stripe) + comptes.

## 🤖 Idées avancées (vision)

- [ ] **Analyse photo de l'eau** : l'utilisateur prend une photo de sa piscine
      (et/ou d'une bandelette de test), l'appli analyse la couleur/limpidité et
      en déduit un diagnostic + planning détaillé. → IA de vision + backend.
- [ ] Reconnaissance de bandelette (lecture des couleurs = valeurs chlore / pH /
      TAC sans saisie manuelle).

## 🧱 Plus tard

- [ ] Blog SEO + affiliation Amazon.
- [ ] PWA (manifest + service worker, installable, hors-ligne).
- [ ] Backend (comptes, sync) — quand le Premium le nécessite.

---

_La fondation actuelle (dossiers `calculateur/`, `diagnostic/`, `lib/storage.ts`,
`premium.astro`) est pensée pour empiler ces briques sans tout refaire._
