/** Linkbestemmingen — versie 1.0 | Laatst gewijzigd: 2026-11-16. Pagina, sectie of externe URL voor menu en footer. */
import { safeUrl } from './validation.js'
import { locateBlock } from './tree.js'
import { sitePath } from './navigation.js'

// De soorten bestemmingen die een menulink of footerlink kan hebben.
export const linkKinds = [
  ['page', 'Pagina'],
  ['section', 'Sectie op een pagina'],
  ['url', 'Externe link'],
]

// Bouwt het adres van een link; een sectie wordt een anker achter het paginapad.
export function linkHref(item, site) {
  if (item.kind === 'url') return safeUrl(item.url) || '#'
  const page = site.pages.find((entry) => entry.id === item.pageId)
  const anchor = item.kind === 'section' && item.sectionId ? `#${item.sectionId}` : ''
  return `${sitePath(page?.slug || '')}${anchor}`
}

// Controleert vóór publicatie dat iedere link naar iets bestaands of een veilige URL wijst.
export function validateLink(item, site) {
  if (!item || typeof item.label !== 'string') throw new Error('Een link mist een label.')
  if (item.kind === 'url') {
    if (!safeUrl(item.url))
      throw new Error(`De link ${item.label} heeft een https-, mailto- of tel-adres nodig.`)
    return
  }
  const page = site.pages.find((entry) => entry.id === item.pageId)
  if (!page) throw new Error(`De menulink ${item.label} verwijst naar een ontbrekende pagina.`)
  if (item.kind === 'section' && !locateBlock(page.sections, item.sectionId))
    throw new Error(`De link ${item.label} verwijst naar een ontbrekende sectie.`)
}

// Somt de bouwstenen van een pagina op, inclusief geneste, voor de sectiekeuze in de editor.
export function listSections(blocks, depth = 0) {
  return blocks.flatMap((block) => [
    { id: block.id, label: `${'— '.repeat(depth)}${block.label}` },
    ...listSections(block.children || [], depth + 1),
  ])
}
