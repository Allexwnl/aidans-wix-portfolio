/** Filmbeweging — versie 1.0 | Laatst gewijzigd: 2026-10-29. Scroll met één frame-update. */
import { useEffect } from 'react'

// Leest de echte iframeviewport; stoppen bij reduced-motion of buiten beeld bespaart werk.
export function useFilmMotion(ref, effect, editing) {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const view = root.ownerDocument.defaultView
    const reduced = view.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    const update = () => {
      frame = 0
      const rect = root.getBoundingClientRect()
      const progress = Math.max(
        0,
        Math.min(1, (view.innerHeight - rect.top) / (view.innerHeight + rect.height))
      )
      const enabled = !editing && !reduced.matches && effect !== 'none'
      root.style.setProperty(
        '--film-inset',
        `${enabled && effect === 'expand' ? Math.max(0, 12 - progress * 30) : 0}%`
      )
      root.style.setProperty(
        '--film-parallax',
        `${enabled && effect === 'parallax' ? (progress - 0.5) * 12 : 0}%`
      )
      root.style.setProperty('--film-scale', enabled && effect === 'parallax' ? '1.15' : '1')
    }
    const schedule = () => {
      if (!frame) frame = view.requestAnimationFrame(update)
    }
    update()
    view.addEventListener('scroll', schedule, { passive: true })
    view.addEventListener('resize', schedule)
    reduced.addEventListener('change', schedule)
    return () => {
      view.cancelAnimationFrame(frame)
      view.removeEventListener('scroll', schedule)
      view.removeEventListener('resize', schedule)
      reduced.removeEventListener('change', schedule)
    }
  }, [ref, effect, editing])
}
