/** Canvasgrepen — versie 1.0 | Laatst gewijzigd: 2026-10-29. Slepen en schalen met één undo-stap. */
import { useRef } from 'react'

// Pointerbeweging is tijdelijk CSS; pas bij loslaten gaat één wijziging naar de documenthistorie.
export function PlacementHandles({ block, onEdit }) {
  const drag = useRef(null)
  const finish = (event, cancel = false) => {
    const current = drag.current
    if (!current) return
    for (const name of ['--drag-x', '--drag-y', '--drag-width'])
      current.section.style.removeProperty(name)
    drag.current = null
    if (cancel) return
    const deltaX = event.clientX - current.x
    const deltaY = event.clientY - current.y
    const values = current.resize
      ? {
          width: Math.max(
            5,
            Math.min(100, Math.round(current.width + (deltaX / current.available) * 100))
          ),
        }
      : {
          offsetX: Math.round((current.values.offsetX || 0) + deltaX),
          offsetY: Math.round((current.values.offsetY || 0) + deltaY),
        }
    onEdit(block.id, current.mobile ? { mobile: { ...block.mobile, ...values } } : values)
  }
  return (
    <div className="placement-handles" onClick={(event) => event.stopPropagation()}>
      {[false, true].map((resize) => (
        <button
          key={String(resize)}
          className={resize ? 'resize-handle' : 'move-handle'}
          title={
            resize
              ? 'Breedte slepen; pijltjes links/rechts'
              : 'Verslepen; pijltjestoetsen verplaatsen'
          }
          aria-label={resize ? 'Bouwsteenbreedte aanpassen' : 'Bouwsteen verslepen'}
          onPointerDown={(event) => {
            event.preventDefault()
            event.stopPropagation()
            const section = event.currentTarget.closest('.node-section')
            const mobile =
              section.ownerDocument.defaultView.matchMedia('(max-width: 600px)').matches
            const values = mobile ? block.mobile || {} : block
            drag.current = {
              x: event.clientX,
              y: event.clientY,
              mobile,
              values,
              width: values.width ?? 100,
              available: section.clientWidth,
              section,
              resize,
            }
            event.currentTarget.setPointerCapture(event.pointerId)
          }}
          onPointerMove={(event) => {
            const current = drag.current
            if (!current) return
            if (current.resize)
              current.section.style.setProperty(
                '--drag-width',
                `${Math.max(5, Math.min(100, current.width + ((event.clientX - current.x) / current.available) * 100))}%`
              )
            else {
              current.section.style.setProperty('--drag-x', `${event.clientX - current.x}px`)
              current.section.style.setProperty('--drag-y', `${event.clientY - current.y}px`)
            }
          }}
          onPointerUp={finish}
          onPointerCancel={(event) => finish(event, true)}
          onKeyDown={(event) => {
            if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return
            event.preventDefault()
            const mobile =
              event.currentTarget.ownerDocument.defaultView.matchMedia('(max-width: 600px)').matches
            const source = mobile ? block.mobile || {} : block
            const key = resize
              ? 'width'
              : ['ArrowLeft', 'ArrowRight'].includes(event.key)
                ? 'offsetX'
                : 'offsetY'
            const delta =
              (['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1) * (event.shiftKey ? 10 : 1)
            const value = (source[key] ?? (resize ? 100 : 0)) + delta
            const values = { [key]: resize ? Math.max(5, Math.min(100, value)) : value }
            onEdit(block.id, mobile ? { mobile: { ...block.mobile, ...values } } : values)
          }}
        >
          {resize ? '↔' : '✥'}
        </button>
      ))}
    </div>
  )
}
