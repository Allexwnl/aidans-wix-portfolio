/** Filmblok — versie 2.0 | Laatst gewijzigd: 2026-11-04. Projectstijl, scrollregie en bioscoop. */
import { useRef, useState } from 'react'
import { safeUrl, youtubeId } from '../../lib/validation.js'
import { useFilmMotion } from '../../hooks/useFilmMotion.js'
import { EditableText } from './EditableText.jsx'
import { CinemaDialog } from './CinemaDialog.jsx'
import { FilmPlayer } from './FilmPlayer.jsx'

// De poster blijft stabiel tijdens het laden; de film opent alleen na een bewuste klik.
export function VideoBlock({ block, editing, onEdit }) {
  const [playing, setPlaying] = useState(false)
  const [message, setMessage] = useState('')
  const root = useRef(null)
  const playButton = useRef(null)
  const id = youtubeId(block.url)
  const style = block.videoStyle || 'cover'
  const cinema = block.presentation === 'cinema'
  useFilmMotion(root, block.scrollEffect || 'none', editing)
  return (
    <div
      ref={root}
      className={`video-block section-inner video-style-${style} ${block.pointerLabel ? 'has-pointer-label' : ''}`}
    >
      <div
        className={`film-frame ${playing && !cinema ? 'is-playing' : ''}`}
        style={{ aspectRatio: block.ratio || '16 / 9' }}
        onPointerMove={(event) => {
          if (event.pointerType !== 'mouse') return
          const rect = event.currentTarget.getBoundingClientRect()
          event.currentTarget.style.setProperty('--pointer-x', `${event.clientX - rect.left}px`)
          event.currentTarget.style.setProperty('--pointer-y', `${event.clientY - rect.top}px`)
        }}
      >
        <img
          src={
            safeUrl(block.image, true) ||
            (id ? `https://i.ytimg.com/vi/${id}/maxresdefault.jpg` : '/images/coast.jpg')
          }
          alt={block.title || 'Filmomslag'}
        />
        {playing && id && !cinema ? (
          <>
            <FilmPlayer id={id} block={block} muted={block.presentation === 'muted'} />
            <button
              className="film-stop"
              onClick={() => {
                setPlaying(false)
                requestAnimationFrame(() => playButton.current?.focus())
              }}
            >
              Film sluiten ×
            </button>
          </>
        ) : (
          <>
            {style === 'cover' && (
              <>
                <div className="film-gradient" />
                <div className="film-topline">
                  <span>{block.category || 'FILM'}</span>
                  <span>{block.year || '2026'} ↗</span>
                </div>
              </>
            )}
            <button
              ref={playButton}
              className="film-play"
              aria-label={`Bekijk ${block.title}`}
              onClick={(event) => {
                if (id) setPlaying(event.currentTarget.ownerDocument)
                else
                  setMessage(
                    editing
                      ? 'Voeg een YouTube-link toe bij de instellingen van dit videoblok.'
                      : 'Deze film is binnenkort beschikbaar.'
                  )
              }}
            >
              <svg width="18" height="20" viewBox="0 0 18 20" aria-hidden="true">
                <path d="M2 1L17 10L2 19Z" fill="currentColor" />
              </svg>
              <span>{id ? 'BEKIJK DE FILM' : 'JOUW FILM KOMT HIER'}</span>
            </button>
            {block.pointerLabel && (
              <span className="film-pointer" aria-hidden="true">
                BEKIJK FILM ↗
              </span>
            )}
            {style === 'cover' && (
              <div className="film-caption">
                <span>{block.client || 'PROJECT'}</span>
                <EditableText
                  block={block}
                  field="title"
                  tag="h2"
                  editing={editing}
                  onEdit={onEdit}
                />
                <span>BEELD ZEGT MEER. ↗</span>
              </div>
            )}
          </>
        )}
      </div>
      {playing && id && cinema && (
        <CinemaDialog
          document={playing}
          title={block.title}
          onClose={() => {
            setPlaying(false)
            playButton.current?.focus()
          }}
        >
          <FilmPlayer id={id} block={block} />
        </CinemaDialog>
      )}
      {message && (
        <p className="video-message" role="status">
          {message}
        </p>
      )}
      {style === 'project' && block.visibility?.metadata !== false && (
        <div className="film-project-info">
          {[
            ['client', 'Klant'],
            ['title', 'Project'],
            ['category', 'Type'],
            ['year', 'Jaar'],
          ].map(([field, label]) => (
            <div key={field}>
              <span>{label}</span>
              <EditableText block={block} field={field} editing={editing} onEdit={onEdit} />
            </div>
          ))}
        </div>
      )}
      {style !== 'minimal' && block.visibility?.text !== false && (
        <div className="film-description">
          <span>UITGELICHT PROJECT</span>
          <EditableText block={block} field="text" editing={editing} onEdit={onEdit} />
        </div>
      )}
    </div>
  )
}
