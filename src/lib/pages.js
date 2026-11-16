/** Paginaverwijzingen — versie 2.0 | Laatst gewijzigd: 2026-11-04. Verwijderen zonder kapotte menulinks. */
import { mapBlocks } from './tree.js'
// Verwijdert verwijzingen naar een pagina uit navigatie én projectkaarten.
export function removePage(site, pageId) {
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
    navigation: site.navigation
      .filter((item) => item.pageId !== pageId)
      .map((item) => ({
        ...item,
        children: item.children.filter((child) => child.pageId !== pageId),
      })),
  }
}
