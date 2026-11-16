/** Zijpanelen — versie 1.0 | Laatst gewijzigd: 2026-11-04. Slepen, inklappen en toetsenbord. */
import { useEffect, useRef, useState, useSyncExternalStore } from 'react'

// Op een smal scherm gebruikt de studio de bestaande gestapelde indeling.
function subscribeMobile(callback) {
  const query = window.matchMedia('(max-width: 700px)')
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}
function isMobile() {
  return window.matchMedia('(max-width: 700px)').matches
}

// Breedtes zijn een lokale werkplekvoorkeur en veranderen het portfolio-ontwerp niet.
export function ResizablePanel({ side, children }) {
  const fallback = side === 'left' ? 233 : 280
  const [width, setWidth] = useState(() => {
    try {
      const saved = localStorage.getItem(`aidan:panel:${side}`)
      return saved === null ? fallback : Math.max(0, Math.min(480, Number(saved) || 0))
    } catch {
      return fallback
    }
  })
  const [dragging, setDragging] = useState(false)
  const drag = useRef(null)
  const mobile = useSyncExternalStore(subscribeMobile, isMobile)
  const collapsed = !mobile && width === 0
  const label = side === 'left' ? 'Linkerpaneel' : 'Rechterpaneel'
  useEffect(() => {
    try {
      localStorage.setItem(`aidan:panel:${side}`, String(width))
    } catch {
      /* Een geblokkeerde browseropslag verhindert slepen niet. */
    }
  }, [width, side])
  const resize = (value) =>
    setWidth(value < 100 ? 0 : Math.max(180, Math.min(480, (window.innerWidth - 300) / 2, value)))
  return (
    <div
      className={`resizable-panel panel-${side} ${collapsed ? 'panel-collapsed' : ''}`}
      style={{ '--panel-width': `${collapsed ? 18 : width}px` }}
    >
      <div
        className="resizable-content"
        inert={collapsed || undefined}
        aria-hidden={collapsed || undefined}
      >
        {children}
      </div>
      <button
        className="panel-toggle"
        aria-label={`${label} ${collapsed ? 'uitklappen' : 'inklappen'}`}
        title={`${label} ${collapsed ? 'uitklappen' : 'inklappen'}`}
        onClick={() => setWidth(collapsed ? fallback : 0)}
      >
        {(side === 'left') !== collapsed ? '‹' : '›'}
      </button>
      <div
        className="panel-resizer"
        role="separator"
        tabIndex={0}
        aria-label={`${label} breedte`}
        aria-orientation="vertical"
        aria-valuemin={0}
        aria-valuemax={480}
        aria-valuenow={width}
        onPointerDown={(event) => {
          event.preventDefault()
          drag.current = {
            x: event.clientX,
            width: event.currentTarget.parentElement.getBoundingClientRect().width,
          }
          setDragging(true)
          event.currentTarget.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          if (drag.current)
            resize(
              drag.current.width + (event.clientX - drag.current.x) * (side === 'left' ? 1 : -1)
            )
        }}
        onPointerUp={() => {
          drag.current = null
          setDragging(false)
        }}
        onPointerCancel={() => {
          drag.current = null
          setDragging(false)
        }}
        onKeyDown={(event) => {
          if (event.key === 'Home') {
            event.preventDefault()
            setWidth(0)
          } else if (event.key === 'End') {
            event.preventDefault()
            resize(480)
          } else if (['ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault()
            resize(
              width +
                (event.key === 'ArrowRight' ? 1 : -1) *
                  (side === 'left' ? 1 : -1) *
                  (event.shiftKey ? 50 : 10)
            )
          }
        }}
      />
      {dragging && <div className="panel-drag-shield" />}
    </div>
  )
}
