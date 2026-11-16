/** Documentbewerkingen — versie 2.0 | Laatst gewijzigd: 2026-11-04. Pure bewerkingen voor undo en tests. */
import { mapBlocks } from './tree.js'
import { initialSite } from '../data/initialSite.js'

// Maakt een onafhankelijke bouwsteen met veilige startinstellingen.
export function createBlock(type) {
  if (type === 'container')
    return {
      id: crypto.randomUUID(),
      type,
      label: 'Container',
      title: '',
      text: '',
      children: [],
      layout: { mode: 'grid', columns: 2, gap: 24, padding: 24, minHeight: 180 },
      spacing: 20,
      width: 100,
      animation: 'none',
      mobile: { layout: { columns: 1 } },
    }
  if (type === 'columns')
    return {
      id: crypto.randomUUID(),
      type,
      label: 'Vrije compositie',
      title: 'Compositie',
      spacing: 60,
      width: 100,
      align: 'left',
      columns: 2,
      gap: 30,
      animation: 'rise',
      duration: 800,
      mobile: { columns: 1 },
      items: [
        {
          id: crypto.randomUUID(),
          type: 'image',
          title: 'Een blik op de wereld',
          image: '/images/forest.jpg',
        },
        {
          id: crypto.randomUUID(),
          type: 'text',
          title: 'Jouw verhaal.\nJouw perspectief.',
          text: 'Combineer beeld, tekst, knoppen en video. Geef ieder onderdeel zijn eigen plek.',
          vertical: 'center',
        },
      ],
    }
  const example = initialSite.pages
    .flatMap((page) => page.sections)
    .find((block) => block.type === type)
  return {
    ...(example
      ? structuredClone(example)
      : {
          type,
          label: type === 'gallery' ? 'Fotocarousel' : 'Tekst',
          title: 'Jouw verhaal begint hier.',
          text: 'Klik op deze tekst om hem aan te passen.',
          animation: 'fade',
          duration: 800,
          spacing: 60,
          width: 100,
          align: 'left',
          mobile: {},
          items:
            type === 'gallery'
              ? [
                  {
                    id: crypto.randomUUID(),
                    image: '/images/coast.jpg',
                    title: 'Een moment om te bewaren',
                  },
                  {
                    id: crypto.randomUUID(),
                    image: '/images/forest.jpg',
                    title: 'Een ander perspectief',
                  },
                ]
              : [],
        }),
    id: crypto.randomUUID(),
  }
}

// Past alleen de doelpagina en geselecteerde sectie aan; de originele versie blijft intact.
export function updateBlock(site, pageId, blockId, patch) {
  return {
    ...site,
    pages: site.pages.map((page) =>
      page.id === pageId
        ? {
            ...page,
            sections: mapBlocks(page.sections, (block) =>
              block.id === blockId ? { ...block, ...patch } : block
            ),
          }
        : page
    ),
  }
}

// Verplaatst een sectie op basis van index; ongeldige verplaatsingen veranderen niets.
export function moveBlock(site, pageId, from, to) {
  return {
    ...site,
    pages: site.pages.map((page) => {
      if (
        page.id !== pageId ||
        to < 0 ||
        to >= page.sections.length ||
        from < 0 ||
        from >= page.sections.length
      )
        return page
      const sections = [...page.sections]
      sections.splice(to, 0, sections.splice(from, 1)[0])
      return { ...page, sections }
    }),
  }
}
