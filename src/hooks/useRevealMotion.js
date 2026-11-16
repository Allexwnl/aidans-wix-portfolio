/** Onthullen bij scrollen — versie 1.0 | Laatst gewijzigd: 2026-11-16. Start animaties en bewaakt zichtbaarheid. */
import { useEffect, useSyncExternalStore } from 'react'

// Dezelfde grens als de mobiele CSS-breakpoint in site.css.
const compactQuery = '(max-width: 600px)'

// Nummert de onderdelen van een bouwsteen zodat ze na elkaar kunnen verschijnen.
function tagStagger(layer) {
  // Lijsten (raster, galerij, compositie, container) gaan voor; anders de eerste groep met meerdere onderdelen.
  let group = layer.querySelector(
    '.container-block, .project-grid, .gallery-track, .composition-grid'
  )
  if (!group) {
    group = layer
    while (group.children.length === 1) group = group.children[0]
  }
  Array.from(group.children).forEach((item, index) => {
    item.dataset.stagger = ''
    item.style.setProperty('--stagger-index', Math.min(index, 12))
  })
}

// Zet 'in-view' op bewegingslagen volgens hun trigger en meldt of de mobiele weergave actief is.
export function useRevealMotion(root, editing, pageKey, sections) {
  // Volgt de viewport van het document waarin de site staat (ook het editor-iframe).
  const subscribe = (notify) => {
    const query = root.current?.ownerDocument.defaultView?.matchMedia?.(compactQuery)
    query?.addEventListener('change', notify)
    return () => query?.removeEventListener('change', notify)
  }
  const compact = useSyncExternalStore(
    subscribe,
    () => !!root.current?.ownerDocument.defaultView?.matchMedia?.(compactQuery).matches
  )
  useEffect(() => {
    const view = root.current?.ownerDocument.defaultView
    if (!view) return
    const nodes = Array.from(root.current.querySelectorAll('.node-section'))
    const layerOf = (node) => node.querySelector(':scope > .node-motion')
    const layers = nodes.map(layerOf).filter(Boolean)
    if (!editing)
      layers.filter((layer) => layer.classList.contains('motion-stagger')).forEach(tagStagger)
    // Vangnet: zonder IntersectionObserver blijft niets verborgen.
    if (!view.IntersectionObserver) {
      layers.forEach((layer) => layer.classList.add('in-view'))
      return
    }
    // Toont een laag bij binnenkomst en verbergt hem alleen opnieuw als herhalen aan staat.
    const reveal = (entries, observer) =>
      entries.forEach((entry) => {
        const layer = layerOf(entry.target)
        if (!layer) return
        if (entry.isIntersecting) {
          layer.classList.add('in-view')
          if (!layer.dataset.repeat) observer.unobserve(entry.target)
        } else if (layer.dataset.repeat) {
          layer.classList.remove('in-view')
        }
      })
    const early = new view.IntersectionObserver(reveal, {
      threshold: 0,
      rootMargin: '0px 0px -24px 0px',
    })
    // 'Pas verder in beeld' wacht tot de bouwsteen ruim een derde van het scherm is ingeschoven.
    const late = new view.IntersectionObserver(reveal, {
      threshold: 0,
      rootMargin: '0px 0px -35% 0px',
    })
    nodes.forEach((node) => {
      const trigger = layerOf(node)?.dataset.trigger
      if (trigger !== 'load') (trigger === 'center' ? late : early).observe(node)
    })
    // 'Direct bij openen' start één frame na het tekenen, zodat de overgang zichtbaar is.
    const frame = view.requestAnimationFrame(() =>
      layers
        .filter((layer) => layer.dataset.trigger === 'load')
        .forEach((layer) => layer.classList.add('in-view'))
    )
    return () => {
      early.disconnect()
      late.disconnect()
      view.cancelAnimationFrame(frame)
    }
  }, [root, editing, pageKey, sections, compact])
  return compact
}
