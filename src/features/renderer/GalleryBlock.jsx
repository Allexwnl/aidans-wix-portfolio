/** Galerij — versie 2.1 | Laatst gewijzigd: 2026-11-16. Carousel, raster of lijst; onderdelen onafhankelijk aan/uit. */
import { useRef, useState } from 'react'
import { safeUrl } from '../../lib/validation.js'
import { imageStyle, photoLabelText } from '../../lib/images.js'
import { EditableText } from './EditableText.jsx'

// Native scroll-snap houdt touch, trackpad en toetsenbord bruikbaar zonder knoppen.
export function GalleryBlock({ block, editing, onEdit }) {
  const track = useRef(null)
  // Index van de foto die nu vooraan staat; stuurt de paginapunten aan.
  const [active, setActive] = useState(0)
  const items = block.items || []
  const mode = block.galleryMode || 'carousel'
  const carousel = mode === 'carousel'
  // Scrollt de carousel naar een positie en respecteert de voorkeur voor minder beweging.
  const scrollTo = (left) => {
    const element = track.current
    const reduced = element.ownerDocument.defaultView.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
    element.scrollTo({ left, behavior: reduced ? 'instant' : 'smooth' })
  }
  return (
    <div className="gallery-block section-inner">
      <div className="gallery-heading">
        <div>
          <EditableText {...{ block, editing, onEdit }} field="title" tag="h2" />
          {block.text && <EditableText {...{ block, editing, onEdit }} field="text" />}
        </div>
        {carousel && block.visibility?.controls !== false && (
          <div>
            <button
              aria-label="Vorige foto"
              onClick={() => scrollTo(track.current.scrollLeft - track.current.clientWidth)}
            >
              ←
            </button>
            <button
              aria-label="Volgende foto"
              onClick={() => scrollTo(track.current.scrollLeft + track.current.clientWidth)}
            >
              →
            </button>
          </div>
        )}
      </div>
      <div
        className={`gallery-track gallery-${mode}`}
        ref={track}
        tabIndex={carousel ? 0 : undefined}
        role="region"
        aria-label={carousel ? 'Fotocarousel' : 'Fotogalerij'}
        style={{
          '--gallery-columns': block.galleryColumns || 3,
          '--mobile-gallery-columns': block.mobile?.galleryColumns ?? 1,
        }}
        // De foto waarvan de linkerrand het dichtst bij de scrollpositie ligt is de actieve.
        onScroll={
          carousel && block.galleryDots
            ? (event) => {
                const offsets = Array.from(event.currentTarget.children).map((child) =>
                  Math.abs(
                    child.offsetLeft -
                      event.currentTarget.offsetLeft -
                      event.currentTarget.scrollLeft
                  )
                )
                setActive(offsets.indexOf(Math.min(...offsets)))
              }
            : undefined
        }
      >
        {items.map((item) => (
          <figure key={item.id}>
            <img
              src={safeUrl(item.image, true) || undefined}
              alt={item.imageSettings?.alt ?? item.title ?? ''}
              style={imageStyle(item.imageSettings)}
              loading="lazy"
            />
            {photoLabelText(item.imageSettings) && (
              <span className="photo-label">{photoLabelText(item.imageSettings)}</span>
            )}
            {block.visibility?.itemCaptions !== false && <figcaption>{item.title}</figcaption>}
          </figure>
        ))}
      </div>
      {carousel && block.galleryDots && items.length > 1 && (
        <div className="gallery-dots">
          {items.map((item, index) => (
            <button
              key={item.id}
              aria-label={`Ga naar foto ${index + 1}`}
              aria-current={index === active ? 'true' : undefined}
              onClick={() =>
                scrollTo(track.current.children[index].offsetLeft - track.current.offsetLeft)
              }
            />
          ))}
        </div>
      )}
    </div>
  )
}
