/** Projectpagina's — versie 1.0 | Laatst gewijzigd: 2026-10-29. Vrij bewerkbare filmische detailpagina's. */
import { createBlock } from './document.js'
import { slugify } from './validation.js'

// Maakt een startpunt voor één project; daarna zijn alle bouwstenen gewoon aanpasbaar.
export function createProjectPage(item) {
  const id = crypto.randomUUID()
  const film = {
    ...createBlock('video'),
    title: item.title,
    image: item.image,
    url: item.url || '',
    text: item.description || 'Vertel het verhaal achter dit project.',
    category: item.category || 'Film',
    client: item.client || item.education || 'Eigen werk',
    year: item.year || '2026',
    fullBleed: true,
    spacing: 0,
  }
  const context = {
    ...createBlock('text'),
    title: item.title,
    text:
      item.description ||
      'Van het eerste idee tot het uiteindelijke beeld. Schrijf hier over je rol, de opdracht en het maakproces.',
  }
  const gallery = {
    ...createBlock('gallery'),
    title: 'Een blik achter de schermen.',
    items: [{ id: crypto.randomUUID(), image: item.image, title: item.title }],
  }
  return {
    id,
    title: item.title,
    slug: `${slugify(item.title) || 'project'}-${id.slice(0, 6)}`,
    sections: [film, context, gallery],
  }
}
