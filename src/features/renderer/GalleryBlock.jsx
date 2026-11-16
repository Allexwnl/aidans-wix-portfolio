/** Carousel — versie 2.0 | Laatst gewijzigd: 2026-11-04. Onderdelen onafhankelijk aan/uit. */
import { useRef } from 'react'
import { safeUrl } from '../../lib/validation.js'
import { EditableText } from './EditableText.jsx'

// Native scroll-snap houdt touch, trackpad en toetsenbord bruikbaar zonder knoppen.
export function GalleryBlock({ block, editing, onEdit }) {
  const track = useRef(null)
  const scroll = (direction) => {
    const element = track.current
    const reduced = element.ownerDocument.defaultView.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    element.scrollBy({
      left: direction * element.clientWidth,
      behavior: reduced ? 'instant' : 'smooth',
    })
  }
  return (
    <div className="gallery-block section-inner">
      <div className="gallery-heading">
        <div>
          <EditableText {...{ block, editing, onEdit }} field="title" tag="h2" />
          {block.text && <EditableText {...{ block, editing, onEdit }} field="text" />}
        </div>
        {block.visibility?.controls !== false && (
          <div>
            <button aria-label="Vorige foto" onClick={() => scroll(-1)}>
              ←
            </button>
            <button aria-label="Volgende foto" onClick={() => scroll(1)}>
              →
            </button>
          </div>
        )}
      </div>
      <div
        className="gallery-track"
        ref={track}
        tabIndex={0}
        role="region"
        aria-label="Fotocarousel"
      >
        {(block.items || []).map((item) => (
          <figure key={item.id}>
            <img
              src={safeUrl(item.image, true) || undefined}
              alt={item.title || ''}
              loading="lazy"
            />
            {block.visibility?.itemCaptions !== false && <figcaption>{item.title}</figcaption>}
          </figure>
        ))}
      </div>
    </div>
  )
}
