/** Bouwsteenvalidatie — versie 1.1 | Laatst gewijzigd: 2026-11-16. Controleert ook geneste inhoud. */
import { youtubeId } from './validation.js'
import { validateRichText } from './richText.js'
import { validateMotion } from './motion.js'
import { validateImageSettings } from './images.js'

// Begrensde diepte en unieke ids voorkomen cycli, onbereikbare selecties en extreem zware imports.
export function validateBlocks(blocks, fonts, ids = new Set(), depth = 0) {
  if (!Array.isArray(blocks) || depth > 12)
    throw new Error('Een indeling mag maximaal 12 containers diep zijn.')
  for (const block of blocks) {
    if (
      !block ||
      typeof block.id !== 'string' ||
      ids.has(block.id) ||
      typeof block.label !== 'string' ||
      ![
        'hero',
        'text',
        'image',
        'video',
        'grid',
        'gallery',
        'contact',
        'columns',
        'container',
      ].includes(block.type)
    )
      throw new Error('Een pagina bevat een ongeldige bouwsteen of dubbele identificatie.')
    ids.add(block.id)
    if (ids.size > 1000) throw new Error('Een pagina mag maximaal 1000 bouwstenen bevatten.')
    if (
      ['title', 'text', 'caption', 'url', 'image', 'client', 'year', 'button'].some(
        (field) => block[field] !== undefined && typeof block[field] !== 'string'
      )
    )
      throw new Error('Tekst en mediaverwijzingen moeten tekstvelden zijn.')
    if (
      ['grid', 'gallery', 'columns'].includes(block.type) &&
      (!Array.isArray(block.items) ||
        block.items.some(
          (item) => !item || typeof item.id !== 'string' || typeof item.title !== 'string'
        ))
    )
      throw new Error('Controleer de items in het raster, de compositie of de galerij.')
    if (block.type === 'video' && block.url && !youtubeId(block.url))
      throw new Error(`Controleer de YouTube-link bij ${block.label}.`)
    // Onbekende animaties zouden inhoud verborgen kunnen laten.
    validateMotion(block)
    // Afbeeldingsinstellingen van de bouwsteen en van iedere galerijfoto.
    validateImageSettings(block.imageSettings)
    for (const item of block.items || []) validateImageSettings(item.imageSettings)
    if (
      ![undefined, 'carousel', 'grid', 'list'].includes(block.galleryMode) ||
      [block.galleryColumns, block.mobile?.galleryColumns].some(
        (count) => count !== undefined && (!Number.isInteger(count) || count < 1 || count > 6)
      )
    )
      throw new Error(`Controleer de galerijweergave bij ${block.label}.`)
    if (block.type === 'container') validateBlocks(block.children, fonts, ids, depth + 1)
    else if (block.children) throw new Error('Alleen containers mogen kinderen bevatten.')
    for (const rich of Object.values(block.richText || {})) {
      if (typeof rich?.plain !== 'string') throw new Error('Ongeldige tekstinhoud.')
      validateRichText(rich.nodes)
    }
    for (const settings of [block, block.mobile || {}]) {
      for (const style of Object.values(settings.typography || {})) {
        if (!style || (style.fontFamily && !fonts.has(style.fontFamily)))
          throw new Error('Een tekst verwijst naar een ontbrekend lettertype.')
        if (style.color && !/^#[0-9a-f]{6}$/i.test(style.color))
          throw new Error('Ongeldige tekstkleur.')
      }
      if (
        settings.layout?.columns !== undefined &&
        (!Number.isInteger(settings.layout.columns) ||
          settings.layout.columns < 1 ||
          settings.layout.columns > 12)
      )
        throw new Error('Kies tussen 1 en 12 kolommen.')
    }
  }
}
