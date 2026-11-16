/** Projectraster — versie 2.0 | Laatst gewijzigd: 2026-11-04. Categorie- en leerjaarfilters. */
import { useState } from 'react'
import { safeUrl, youtubeId } from '../../lib/validation.js'
import { EditableText } from './EditableText.jsx'
import { ProjectCard } from './ProjectCard.jsx'

// Filtert projectgegevens zonder verplichte schoolstructuur op te leggen.
export function ProjectGrid({ block, editing, onEdit, site, onNavigate }) {
  const [category, setCategory] = useState('Alles')
  const [year, setYear] = useState('Alle leerjaren')
  const [video, setVideo] = useState(null)
  const categories = [
    'Alles',
    ...new Set((block.items || []).map((item) => item.category).filter(Boolean)),
  ]
  const years = [...new Set((block.items || []).map((item) => item.schoolYear).filter(Boolean))]
  return (
    <div className="projects-block section-inner">
      <div className="projects-heading">
        <div>
          <span className="site-eyebrow">GESELECTEERD WERK</span>
          <EditableText block={block} field="title" tag="h2" editing={editing} onEdit={onEdit} />
        </div>
        <span>ELK VERHAAL IS ANDERS. ↙</span>
      </div>
      {block.visibility?.filters !== false && (
        <div className="project-filters">
          {categories.map((item) => (
            <button
              key={item}
              className={category === item ? 'active' : ''}
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          ))}
          {years.length > 0 && (
            <select
              aria-label="Filter leerjaar"
              value={year}
              onChange={(event) => setYear(event.target.value)}
            >
              <option>Alle leerjaren</option>
              {years.map((item) => (
                <option key={item} value={item}>
                  Leerjaar {item}
                </option>
              ))}
            </select>
          )}
        </div>
      )}
      <div className="project-grid">
        {(block.items || [])
          .filter(
            (item) =>
              (block.visibility?.filters === false ||
                category === 'Alles' ||
                item.category === category) &&
              (block.visibility?.filters === false ||
                year === 'Alle leerjaren' ||
                item.schoolYear === year)
          )
          .map((item) => (
            <ProjectCard
              key={item.id}
              item={item}
              site={site}
              onNavigate={onNavigate}
              onOpen={setVideo}
            />
          ))}
      </div>
      {video && (
        <div
          className="project-dialog"
          role="dialog"
          aria-modal="true"
          aria-label={video.title}
          onKeyDown={(event) => {
            if (event.key === 'Escape') setVideo(null)
          }}
        >
          <button autoFocus onClick={() => setVideo(null)}>
            Sluiten ×
          </button>
          <h2>{video.title}</h2>
          {youtubeId(video.url) ? (
            <iframe
              title={video.title}
              src={`https://www.youtube-nocookie.com/embed/${youtubeId(video.url)}?autoplay=1`}
              allow="autoplay; fullscreen"
              allowFullScreen
            />
          ) : (
            <>
              <img src={safeUrl(video.image, true)} alt={video.title} />
              <p>
                {video.category} · {video.year} —{' '}
                {editing
                  ? 'Voeg een YouTube-link toe om een film te tonen.'
                  : 'Meer over dit project volgt binnenkort.'}
              </p>
            </>
          )}
        </div>
      )}
    </div>
  )
}
