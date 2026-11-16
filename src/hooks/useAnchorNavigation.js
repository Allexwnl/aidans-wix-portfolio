/** Ankernavigatie — versie 1.0 | Laatst gewijzigd: 2026-11-16. Scrollt naar een sectie binnen of na een paginawissel. */
import { useEffect, useRef } from 'react'

// Brengt een bouwsteen in beeld; bij minder beweging of na een paginawissel zonder animatie.
function scrollToSection(root, sectionId, smooth) {
  const node = root.current?.querySelector(`[data-section-id="${CSS.escape(sectionId)}"]`)
  if (!node) return false
  const view = node.ownerDocument.defaultView
  const reduced = view.matchMedia('(prefers-reduced-motion: reduce)').matches
  node.scrollIntoView({ behavior: smooth && !reduced ? 'smooth' : 'instant', block: 'start' })
  return true
}

// Geeft een navigatiefunctie terug die naast de pagina ook een sectie als doel accepteert.
export function useAnchorNavigation(root, displayedId, pageId, onNavigate) {
  // Sectie die na de eerstvolgende paginawissel in beeld moet komen.
  const pending = useRef('')
  useEffect(() => {
    const view = root.current?.ownerDocument.defaultView
    // Een adres met #sectie opent direct op die plek; anders begint een pagina bovenaan.
    // Het anker wordt letterlijk vergeleken met bouwsteen-id's; een vreemde hash vindt gewoon niets.
    const target = pending.current || view?.location.hash.slice(1) || ''
    pending.current = ''
    if (!target || !scrollToSection(root, target, false))
      view?.scrollTo({ top: 0, behavior: 'instant' })
  }, [root, displayedId])
  if (!onNavigate) return undefined
  return (targetId, sectionId) => {
    // Op dezelfde pagina volstaat scrollen; tijdens een lopende overgang gaat navigeren voor.
    if (targetId === pageId && pageId === displayedId) {
      if (sectionId) scrollToSection(root, sectionId, true)
      else root.current?.ownerDocument.defaultView.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    pending.current = sectionId || ''
    onNavigate(targetId)
  }
}
