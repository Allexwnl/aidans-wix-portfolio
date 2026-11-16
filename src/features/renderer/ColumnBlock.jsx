/** Kolommen — versie 1.0 | Laatst gewijzigd: 2026-10-29. Vrij samen te stellen beeld- en tekstcomposities. */
import { safeUrl, youtubeId } from '../../lib/validation.js'
import { useRef } from 'react'

// Een responsieve compositie ondersteunt tekst, beeld, knoppen en video per cel.
export function ColumnBlock({ block, editing, onEdit }) {
  const drag = useRef(null)
  return (
    <div className="columns-block section-inner">
      <div
        className="composition-grid"
        style={{
          '--columns': block.columns || 2,
          '--column-gap': `${block.gap ?? 24}px`,
          '--mobile-columns': block.mobile?.columns || 1,
        }}
      >
        {(block.items || []).map((item) => (
          <div
            key={item.id}
            className={`composition-item ${editing ? 'can-drag' : ''}`}
            draggable={editing}
            onDragStart={(event) => {
              drag.current = { x: event.clientX, y: event.clientY }
              event.dataTransfer.setData('text/plain', item.id)
            }}
            onDragOver={editing ? (event) => event.preventDefault() : undefined}
            onDragEnd={(event) => {
              if (!drag.current || (!event.clientX && !event.clientY)) return
              const mobile = event.currentTarget.ownerDocument.defaultView.innerWidth <= 600
              const keyX = mobile ? 'mobileOffsetX' : 'offsetX'
              const keyY = mobile ? 'mobileOffsetY' : 'offsetY'
              const patch = {
                [keyX]: Math.max(
                  -500,
                  Math.min(500, Math.round((item[keyX] || 0) + event.clientX - drag.current.x))
                ),
                [keyY]: Math.max(
                  -500,
                  Math.min(500, Math.round((item[keyY] || 0) + event.clientY - drag.current.y))
                ),
              }
              onEdit(block.id, {
                items: block.items.map((entry) =>
                  entry.id === item.id ? { ...entry, ...patch } : entry
                ),
              })
              drag.current = null
            }}
            style={{
              textAlign: item.align || 'left',
              '--item-x': `${Number(item.offsetX) || 0}px`,
              '--item-y': `${Number(item.offsetY) || 0}px`,
              '--mobile-item-x': `${Number(item.mobileOffsetX) || 0}px`,
              '--mobile-item-y': `${Number(item.mobileOffsetY) || 0}px`,
              alignSelf: item.vertical || 'start',
            }}
          >
            {item.type === 'image' ? (
              <img
                src={safeUrl(item.image, true) || undefined}
                alt={item.title || ''}
                loading="lazy"
              />
            ) : item.type === 'video' && youtubeId(item.url) ? (
              <iframe
                title={item.title || 'Film'}
                src={`https://www.youtube-nocookie.com/embed/${youtubeId(item.url)}`}
                allow="fullscreen"
                allowFullScreen
              />
            ) : item.type === 'button' ? (
              <a className="composition-button" href={safeUrl(item.url) || '#'}>
                {item.title || 'Meer ontdekken ↗'}
              </a>
            ) : (
              <>
                <h2>{item.title}</h2>
                <p>{item.text}</p>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
