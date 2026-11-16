/** Eigen fonts — versie 1.0 | Laatst gewijzigd: 2026-10-29. Draagbare, begrensde lettertypebestanden. */
import { mapBlocks } from './tree.js'
export const systemFonts = ['Arial', 'Georgia', 'Verdana', 'Courier New']

// Controleert zowel bestandssignatuur als browserondersteuning vóór opname in het ontwerp.
export async function importFont(file, existing = []) {
  if (!file || file.size > 1024 * 1024)
    throw new Error('Gebruik een fontbestand van maximaal 1 MB.')
  const bytes = new Uint8Array(await file.arrayBuffer())
  const signature = Array.from(bytes.slice(0, 4), (byte) => String.fromCharCode(byte)).join('')
  const format = { wOF2: 'woff2', wOFF: 'woff', OTTO: 'otf', '\u0000\u0001\u0000\u0000': 'ttf' }[
    signature
  ]
  if (!format) throw new Error('Gebruik een geldig WOFF2-, WOFF-, TTF- of OTF-bestand.')
  if (
    existing.reduce((total, font) => total + font.data.length, 0) + (bytes.length * 4) / 3 >
    3 * 1024 * 1024
  )
    throw new Error('Eigen fonts mogen samen maximaal 3 MB innemen. Verwijder eerst een font.')
  const id = crypto.randomUUID()
  const family = `aidan-font-${id}`
  try {
    await new FontFace(family, bytes).load()
  } catch {
    throw new Error('De browser kan dit lettertype niet lezen.')
  }
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return {
    id,
    name: file.name.replace(/\.[^.]+$/, ''),
    family,
    data: `data:font/${format};base64,${btoa(binary)}`,
  }
}

// Deze grens geldt ook voor geïmporteerde JSON, zodat publiceren geen onbegrensde blobs accepteert.
export function validateFonts(fonts = []) {
  if (!Array.isArray(fonts) || fonts.length > 30) throw new Error('Ongeldige lettertypenlijst.')
  const families = new Set(systemFonts)
  let total = 0
  for (const font of fonts) {
    if (
      !font ||
      typeof font.name !== 'string' ||
      !/^aidan-font-[a-f0-9-]{36}$/.test(font.family) ||
      families.has(font.family) ||
      typeof font.data !== 'string' ||
      !/^data:font\/(woff2?|ttf|otf);base64,[a-z0-9+/]+=*$/i.test(font.data) ||
      font.data.length > 1.4 * 1024 * 1024
    )
      throw new Error('Een eigen lettertype is ongeldig of te groot.')
    families.add(font.family)
    total += font.data.length
  }
  if (total > 3 * 1024 * 1024) throw new Error('Eigen fonts zijn samen groter dan 3 MB.')
  return families
}

// Verwijderen herstelt alle verwijzingen, ook in geneste en mobiele tekstinstellingen.
export function removeFont(site, family) {
  const clear = (typography) =>
    typography &&
    Object.fromEntries(
      Object.entries(typography).map(([field, style]) => [
        field,
        { ...style, ...(style.fontFamily === family ? { fontFamily: '' } : {}) },
      ])
    )
  return {
    ...site,
    fonts: (site.fonts || []).filter((font) => font.family !== family),
    theme: { ...site.theme, font: site.theme.font === family ? 'Arial' : site.theme.font },
    pages: site.pages.map((page) => ({
      ...page,
      sections: mapBlocks(page.sections, (block) => ({
        ...block,
        ...(block.typography ? { typography: clear(block.typography) } : {}),
        ...(block.mobile?.typography
          ? { mobile: { ...block.mobile, typography: clear(block.mobile.typography) } }
          : {}),
      })),
    })),
  }
}
