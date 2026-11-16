/** Schuifovergang — versie 1.0 | Laatst gewijzigd: 2026-11-16. Pagina's schuiven omhoog via de View Transitions API. */
// Volgnummer per document, zodat een onderbroken overgang de stijl van de volgende niet weghaalt.
const runs = new WeakMap()

// Oudere browsers zonder View Transitions wisselen direct van pagina.
export function supportsPush(document) {
  return typeof document.startViewTransition === 'function'
}

// Laat de oude pagina naar boven wegschuiven terwijl de nieuwe van onderen binnenkomt.
export function startPushTransition(document, duration, show) {
  const root = document.documentElement
  const run = (runs.get(document) || 0) + 1
  runs.set(document, run)
  // De klasse beperkt de animatie in site.css tot deze overgang; de duur komt uit de instellingen.
  root.classList.add('vt-push')
  root.style.setProperty('--push-duration', `${duration}ms`)
  return document
    .startViewTransition(show)
    .finished.catch(() => {})
    .then(() => {
      if (runs.get(document) === run) root.classList.remove('vt-push')
    })
}
