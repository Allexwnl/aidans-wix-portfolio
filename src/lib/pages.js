/** Paginaverwijzingen — versie 2.1 | Laatst gewijzigd: 2026-11-16. Verwijderen zonder kapotte menulinks. */
import { mapBlocks } from './tree.js'
// Verwijdert verwijzingen naar een pagina uit navigatie, footer én projectkaarten.
export function removePage(site, pageId) {
  // Externe links hebben geen pagina nodig en blijven dus staan.
  const keeps = (item) => item.kind === 'url' || item.pageId !== pageId
  const footer = site.settings?.footerConfig
  return {
    ...site,
    pages: site.pages
      .filter((page) => page.id !== pageId)
      .map((page) => ({
        ...page,
        sections: mapBlocks(page.sections, (block) =>
          block.items
            ? {
                ...block,
                items: block.items.map((item) =>
                  item.pageId === pageId ? { ...item, pageId: '' } : item
                ),
              }
            : block
        ),
      })),
    navigation: site.navigation.filter(keeps).map((item) => ({
      ...item,
      children: item.children.filter(keeps),
    })),
    settings: footer?.links
      ? { ...site.settings, footerConfig: { ...footer, links: footer.links.filter(keeps) } }
      : site.settings,
  }
}
