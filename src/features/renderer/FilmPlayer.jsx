/** YouTube-speler — versie 1.0 | Laatst gewijzigd: 2026-10-29. Gedeelde inline- en bioscoopbron. */
// De kijker behoudt YouTube-bediening en kwaliteitskeuze; verwijderen stopt de film.
export function FilmPlayer({ id, block, muted = false }) {
  return (
    <iframe
      className="film-player"
      src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1&rel=0&mute=${muted ? 1 : 0}&start=${Math.max(0, Number(block.start) || 0)}${block.loop || muted ? `&loop=1&playlist=${id}` : ''}`}
      title={block.title || 'Projectfilm'}
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
      allowFullScreen
      referrerPolicy="strict-origin-when-cross-origin"
    />
  )
}
