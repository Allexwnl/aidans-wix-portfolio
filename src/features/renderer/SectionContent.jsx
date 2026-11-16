/** Bouwstenen — versie 2.0 | Laatst gewijzigd: 2026-11-04. Tekst, film, beeld en contact. */
import { EditableText } from './EditableText.jsx'
import { VideoBlock } from './VideoBlock.jsx'
import { GalleryBlock } from './GalleryBlock.jsx'
import { ProjectGrid } from './ProjectGrid.jsx'
import { ColumnBlock } from './ColumnBlock.jsx'
import { safeUrl } from '../../lib/validation.js'

// Kiest de juiste bouwsteen; stijl en inhoud komen volledig uit het document.
export function SectionContent({ block, editing, onEdit, site, onNavigate }) {
  const props = { block, editing, onEdit, site, onNavigate }
  if (block.type === 'hero')
    return (
      <div className="hero-block section-inner">
        <EditableText {...props} field="text" tag="p" className="site-eyebrow" />
        <EditableText {...props} field="title" tag="h1" />
        <div className="hero-bottom">
          <EditableText {...props} field="caption" tag="p" />
          <span>
            SCROLL OM TE ONTDEKKEN <b>↓</b>
          </span>
        </div>
      </div>
    )
  if (block.type === 'video') return <VideoBlock {...props} />
  if (block.type === 'grid') return <ProjectGrid {...props} />
  if (block.type === 'columns') return <ColumnBlock {...props} />
  if (block.type === 'gallery') return <GalleryBlock {...props} />
  if (block.type === 'image')
    return (
      <figure className="image-block section-inner">
        <img src={safeUrl(block.image, true) || undefined} alt={block.text || ''} loading="lazy" />
        <figcaption>
          <EditableText {...props} field="title" tag="span" />
        </figcaption>
      </figure>
    )
  if (block.type === 'contact')
    return (
      <div className="contact-block section-inner">
        <span className="site-eyebrow">HET VOLGENDE VERHAAL</span>
        <EditableText {...props} field="title" tag="h2" />
        <EditableText {...props} field="text" tag="p" />
        {block.visibility?.button !== false && (
          <a
            href={safeUrl(block.url) || '#'}
            onClick={editing ? (event) => event.preventDefault() : undefined}
          >
            {block.button || 'Neem contact op ↗'}
          </a>
        )}
      </div>
    )
  return (
    <div className="text-block section-inner">
      <EditableText {...props} field="title" tag="h2" />
      <EditableText {...props} field="text" tag="p" />
    </div>
  )
}
