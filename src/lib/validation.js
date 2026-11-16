/** Validatie — versie 2.0 | Laatst gewijzigd: 2026-11-04. Veilige bronnen en publicatiecontrole. */
import { validateFonts } from './fonts.js'
import { validateBlocks } from './blockValidation.js'
// Accepteert alleen echte YouTube-hosts en geldige video-identificaties.
export function youtubeId(value = '') {
  try {
    const url = new URL(value)
    if (!['https:', 'http:'].includes(url.protocol)) return ''
    const host = url.hostname.replace(/^www\./, '')
    const id =
      host === 'youtu.be'
        ? url.pathname.slice(1)
        : ['youtube.com', 'm.youtube.com', 'youtube-nocookie.com'].includes(host)
          ? url.searchParams.get('v') || url.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1]
          : ''
    return /^[\w-]{11}$/.test(id || '') ? id : ''
  } catch {
    return ''
  }
}

// Weigert uitvoerbare URL-schema's; lokale voorbeeldbeelden zijn toegestaan.
export function safeUrl(value = '', image = false) {
  if (image && /^\/images\/[\w.-]+$/.test(value)) return value
  try {
    const url = new URL(value)
    return url.protocol === 'https:' || (!image && ['mailto:', 'tel:'].includes(url.protocol))
      ? value
      : ''
  } catch {
    return ''
  }
}

// Controleert het document voordat een concept als release wordt gepubliceerd.
export function validateSite(site) {
  if (
    site?.schemaVersion !== 1 ||
    typeof site.name !== 'string' ||
    !Array.isArray(site.pages) ||
    !site.pages.length ||
    site.pages.length > 100 ||
    !site.theme ||
    !Array.isArray(site.navigation)
  )
    throw new Error('De website heeft minimaal één pagina, een thema en navigatie nodig.')
  const fonts = validateFonts(site.fonts)
  if (
    !fonts.has(site.theme.font) ||
    ['background', 'foreground', 'accent'].some((key) => !/^#[0-9a-f]{6}$/i.test(site.theme[key]))
  )
    throw new Error('Controleer de themakleuren en het lettertype.')
  if (
    site.navigation.some(
      (item) =>
        !item ||
        typeof item.id !== 'string' ||
        typeof item.label !== 'string' ||
        !Array.isArray(item.children)
    )
  )
    throw new Error('De navigatie bevat een ongeldig menu-item.')
  const slugs = new Set()
  const ids = new Set()
  for (const page of site.pages) {
    if (
      typeof page?.id !== 'string' ||
      ids.has(page.id) ||
      typeof page.title !== 'string' ||
      !page.title.trim() ||
      typeof page.slug !== 'string' ||
      !/^[a-z0-9-]*$/.test(page.slug) ||
      ['studio', 'preview'].includes(page.slug) ||
      slugs.has(page.slug)
    )
      throw new Error('Geef iedere pagina een unieke geldige URL en een naam.')
    slugs.add(page.slug)
    ids.add(page.id)
    if (!Array.isArray(page.sections)) throw new Error('Deze pagina mist bouwstenen.')
    validateBlocks(page.sections, fonts)
  }
  for (const item of site.navigation.flatMap((item) => [item, ...(item.children || [])]))
    if (!site.pages.some((page) => page.id === item.pageId))
      throw new Error(`De menulink ${item.label} verwijst naar een ontbrekende pagina.`)
  if (!slugs.has('')) throw new Error('Een pagina moet de lege URL hebben als homepage.')
  return site
}

// Zet vrije invoer om in een leesbare paginanaam voor de URL.
export function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}
