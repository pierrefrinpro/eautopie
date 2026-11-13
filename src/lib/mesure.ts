// Événements de mesure d'audience envoyés à Google Tag Manager.
// Rien ne part tant que le visiteur n'a pas accepté les cookies de mesure.
// Dans GTM : créer un déclencheur « Événement personnalisé » par nom
// d'événement, puis une balise GA4 « Événement » et marquer ces
// événements comme conversions dans GA4.
import { consentementAccorde } from './consentement';

export type EvenementMesure = 'calcul_effectue' | 'inscription_liste_attente';

export function mesurer(
  evenement: EvenementMesure,
  details: Record<string, string> = {}
): void {
  if (!consentementAccorde()) return;
  const w = window as unknown as { dataLayer?: unknown[] };
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push({ event: evenement, ...details });
}
