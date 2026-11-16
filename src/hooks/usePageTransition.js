/** Paginaovergangen — versie 2.1 | Laatst gewijzigd: 2026-11-16. Ook bij terug/vooruit en snelle navigatie. */
import { useLayoutEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { startPushTransition, supportsPush } from '../lib/pushTransition.js'

// Houdt de vorige pagina vast totdat het doek sluit; de nieuwe pagina verschijnt eronder.
export function usePageTransition(root, pageId, settings, editing) {
  const [displayedId, setDisplayedId] = useState(pageId)
  const displayed = useRef(pageId)
  const layer = useRef(null)
  const kind = settings?.pageTransition || 'none'
  const duration = Math.max(150, Math.min(1000, settings?.transitionDuration || 450))
  const color = settings?.transitionColor || '#23251f'
  useLayoutEffect(() => {
    const document = root.current.ownerDocument
    const view = document.defaultView
    const reduced = view.matchMedia('(prefers-reduced-motion: reduce)')
    let active = true
    let animation
    const previous = layer.current
    const element = previous || document.createElement('div')
    const direct = editing || reduced.matches || kind === 'none'
    // 'push' schuift de pagina's zelf omhoog; daar is geen kleurdoek voor nodig.
    if (kind === 'push') {
      if (displayed.current === pageId) return
      let current = true
      // De microtask houdt de paginawissel uit de synchrone effectfase.
      Promise.resolve().then(() => {
        if (!current) return
        const show = () => {
          displayed.current = pageId
          setDisplayedId(pageId)
        }
        if (direct || !supportsPush(document)) return show()
        // flushSync zet de nieuwe pagina in de DOM voordat de browser het eindbeeld vastlegt.
        startPushTransition(document, duration * 2, () => flushSync(show)).then(() => {
          if (current && !editing)
            root.current?.querySelector('main')?.focus({ preventScroll: true })
        })
      })
      return () => {
        current = false
      }
    }
    if (displayed.current === pageId && !previous) return
    element.className = 'page-transition-cover'
    element.setAttribute('aria-hidden', 'true')
    element.style.background = color
    const horizontal = kind === 'slide-left' || kind === 'slide-right'
    const axis = horizontal ? 'X' : 'Y'
    const direction = kind === 'slide-right' ? -1 : 1
    const curtain = kind !== 'fade'
    const enter = curtain
      ? { transform: `translate${axis}(${100 * direction}%)`, opacity: 1 }
      : { transform: 'none', opacity: 0 }
    const covered = { transform: 'translate(0, 0)', opacity: 1 }
    const exit = curtain
      ? { transform: `translate${axis}(${-100 * direction}%)`, opacity: 1 }
      : { transform: 'none', opacity: 0 }
    // Een nieuwe navigatie gaat door vanaf de huidige doekpositie, zonder witte flits.
    const start = previous
      ? { transform: element.style.transform, opacity: element.style.opacity || 1 }
      : enter
    if (!direct) {
      document.body.append(element)
      layer.current = element
    }
    const run = async () => {
      try {
        if (!direct) {
          animation = element.animate([start, covered], {
            duration,
            easing: 'cubic-bezier(.22,1,.36,1)',
            fill: 'forwards',
          })
          await animation.finished
        }
        if (!active) return
        displayed.current = pageId
        setDisplayedId(pageId)
        // Twee frames laten React committen en de eerste layout van de nieuwe pagina tekenen.
        await new Promise((resolve) =>
          view.requestAnimationFrame(() => view.requestAnimationFrame(resolve))
        )
        if (!active) return
        if (!direct) {
          animation = element.animate([covered, exit], {
            duration,
            easing: 'cubic-bezier(.22,1,.36,1)',
            fill: 'forwards',
          })
          await animation.finished
        }
        if (active && !editing) root.current?.querySelector('main')?.focus({ preventScroll: true })
      } catch {
        /* Een volgende navigatie mag de huidige animatie onderbreken. */
      } finally {
        if (active) {
          element.remove()
          if (layer.current === element) layer.current = null
        }
      }
    }
    // De microtask houdt directe navigatie uit de synchrone effectfase.
    Promise.resolve().then(run)
    const finishReduced = () => {
      if (reduced.matches) animation?.finish()
    }
    reduced.addEventListener('change', finishReduced)
    return () => {
      active = false
      if (layer.current === element) {
        const current = view.getComputedStyle(element)
        element.style.transform = current.transform
        element.style.opacity = current.opacity
      }
      animation?.cancel()
      reduced.removeEventListener('change', finishReduced)
    }
  }, [root, pageId, editing, kind, duration, color])
  useLayoutEffect(
    () => () => {
      layer.current?.remove()
      layer.current = null
    },
    []
  )
  return editing || kind === 'none' ? pageId : displayedId
}
