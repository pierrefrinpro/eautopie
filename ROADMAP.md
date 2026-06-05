# Roadmap EauTopie

> Vision : EauTopie n'est pas « un calculateur de chlore ». C'est l'assistant
> complet qui accompagne un particulier sur **tous les cas réels** d'entretien
> de sa piscine — du dosage quotidien à la remise en route après l'hiver.

## ✅ Fait

**Fondations & déploiement**
- Projet Astro 4 + TypeScript + Tailwind (charte EauTopie) + polices.
- BaseLayout (SEO, Open Graph), Header, Footer 3 colonnes.
- Page d'accueil (hero, 3 piliers, H2 SEO, section Premium, CTA blog).
- Déploiement Cloudflare + domaine eautopie.fr (Gandi), HTTPS, www.
- Page 404, image de partage (og-image).

**Calculateurs**
- [x] **Chlore d'entretien** (LocalStorage, mini-calc volume, sauvegarde mesure).
- [x] **Chlore choc** (dose par m³ selon gravité).
- [x] **pH+ / pH−** (dose selon mesure et cible).

**Diagnostic & suivi**
- [x] **Diagnostic eau verte** complet (questionnaire → plan calculé au volume,
      checklist, planning 5 jours, sauvegarde 1 planning).
- [x] **Suivi** (« Suis ton eau ») : historique des mesures + planning sauvegardé.

**Premium (vitrine)**
- [x] Waitlist Premium (page /premium, formulaire Formspree, état LocalStorage,
      boutons « Passer à Premium » partout).
- [x] Levier de conversion : preview gratuite planning 5 j + teaser verrouillé.

**SEO**
- [x] Sitemap + robots.txt.
- [x] JSON-LD (WebSite, Organization, SoftwareApplication, HowTo, Article,
      BreadcrumbList, FAQPage).
- [x] Breadcrumbs + pages index /calculateur & /diagnostic.
- [x] FAQ (calculateurs) + métas/H2 optimisés.
- [x] **Blog : 10 articles (lot 1)** maillés entre eux et vers les outils.

**Légal & RGPD**
- [x] Mentions légales (GROKIUM EURL) + politique de confidentialité dédiée.
- [x] Bandeau de consentement cookies (GTM chargé uniquement après accord).
- [x] GTM (GTM-5T6CKBDJ) actif.

## ✅ Calculateurs (complets : 8)

- [x] Chlore d'entretien · [x] Chlore choc · [x] pH+/pH−
- [x] **Stabilisant** · [x] **Sel** · [x] **Anti-algues** · [x] **Floculant** · [x] **TAC**
- Composant générique `MiniCalc` (config-driven).

## ✅ Diagnostics guidés (4)

- [x] **Eau verte** (moteur complet : plan + planning + sauvegarde).
- [x] **Eau trouble** · [x] **Ça pique aux yeux** · [x] **Taches sur le liner**
      (mini-parcours guidés, composant `DiagnosticGuide`).
- [ ] À venir si besoin : dépôts/tartre, niveau d'eau, etc.

## ✍️ Blog — lot 2 (à valider/écrire)

Idées proposées : hivernage, piscine au sel, TAC/alcalinité, anti-algues,
floculant, eau dure/calcaire, tester son eau, après l'orage, nettoyer le filtre à
sable, taches sur le liner.

## 📈 Analytics

- [ ] Créer la **balise GA4** dans GTM (ID `G-XXXXXXXXXX`) et publier le conteneur.

## ⭐ Premium (~4,99 €/mois) — à construire

- [ ] **Comptes + backend** (sauvegarde au-delà du LocalStorage, synchro multi-appareils).
- [ ] **Paiement Stripe**.
- [ ] **Planning d'entretien** quotidien/hebdo + **rappels intelligents** (météo).
- [ ] **Multi-piscines**, **historique avancé** (graphes, export).
- [ ] **Dashboard connecté** (infos, diagnostics passés, plannings, rappels).

## 🤖 Idées avancées (vision)

- [ ] **Analyse photo de l'eau** (et/ou bandelette) → diagnostic IA + planning.
- [ ] Reconnaissance de bandelette (lecture des couleurs sans saisie manuelle).

## 🧱 Plus tard

- [ ] Affiliation Amazon (liens produits dans les articles, ex. hors-sol).
- [ ] PWA (manifest + service worker, installable, hors-ligne).
- [ ] Moteur de recherche interne (le `SearchAction` du schema est déjà prêt).

---

_La fondation (dossiers `calculateur/`, `diagnostic/`, `lib/`, content collections
`blog`) est pensée pour empiler ces briques sans tout refaire._
