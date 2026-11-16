/** Publieke links — versie 1.0 | Laatst gewijzigd: 2026-10-29. Houdt lokale demo en cloud gescheiden. */
// Behoudt de expliciete proefmodus bij navigeren binnen een lokale bezoekerssite.
export function sitePath(slug = '') {
  const demo =
    ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname) &&
    new URLSearchParams(location.search).get('demo') === '1'
  return `/${slug}${demo ? '?demo=1' : ''}`
}
