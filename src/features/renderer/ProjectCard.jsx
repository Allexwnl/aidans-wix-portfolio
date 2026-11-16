/** Projectkaart — versie 2.0 | Laatst gewijzigd: 2026-11-04. Echte detailpagina of compacte filmweergave. */
import { safeUrl } from '../../lib/validation.js'
import { sitePath } from '../../lib/navigation.js'

// Een gekoppelde pagina krijgt een normale URL; preview houdt navigatie binnen het canvas.
export function ProjectCard({ item, site, onNavigate, onOpen }) {
  const destination = site?.pages.find((page) => page.id === item.pageId)
  return (
    <article>
      <a
        className="project-image"
        href={destination ? sitePath(destination.slug) : '#'}
        aria-label={`Open ${item.title}`}
        onClick={(event) => {
          if (destination && !onNavigate) return
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
          event.preventDefault()
          event.stopPropagation()
          if (destination) onNavigate(destination.id)
          else onOpen(item)
        }}
      >
        <img
          src={safeUrl(item.image, true) || '/images/building.jpg'}
          alt={item.title}
          loading="lazy"
        />
        <span>↗</span>
      </a>
      <div className="project-meta">
        <h3>{item.title}</h3>
        <span>{item.year}</span>
      </div>
      <p>
        {item.category}
        {item.education ? ` / ${item.education}` : ''}
        {item.schoolYear ? ` / Leerjaar ${item.schoolYear}` : ''}
      </p>
    </article>
  )
}
