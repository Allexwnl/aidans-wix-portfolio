/** Galerij-instellingen — versie 1.0 | Laatst gewijzigd: 2026-11-16. Carousel, raster of lijst met kolommen en paginapunten. */
// Weergaven van de fotobouwsteen.
const galleryModes = [
  ['carousel', 'Carousel'],
  ['grid', 'Raster'],
  ['list', 'Lijst'],
]

// Kolommen zijn per apparaat instelbaar; de mobiele waarde staat los van desktop.
export function GalleryPanel({ block, update, device }) {
  const mobile = device === 'mobile'
  const mode = block.galleryMode || 'carousel'
  const columns = mobile ? (block.mobile?.galleryColumns ?? 1) : block.galleryColumns || 3
  return (
    <div className="settings-group">
      <h3>Galerijweergave</h3>
      <label className="field">
        Weergave
        <select value={mode} onChange={(event) => update({ galleryMode: event.target.value })}>
          {galleryModes.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>
      {mode === 'grid' && (
        <label className="field">
          Kolommen {mobile ? '(mobiel)' : '(desktop)'}
          <input
            type="range"
            min="1"
            max={mobile ? 3 : 6}
            value={columns}
            onChange={(event) =>
              update(
                mobile
                  ? { mobile: { ...block.mobile, galleryColumns: Number(event.target.value) } }
                  : { galleryColumns: Number(event.target.value) }
              )
            }
          />
          <span>{columns}</span>
        </label>
      )}
      {mode === 'carousel' && (
        <label className="toggle-row">
          Paginapunten tonen
          <input
            type="checkbox"
            checked={!!block.galleryDots}
            onChange={(event) => update({ galleryDots: event.target.checked })}
          />
        </label>
      )}
    </div>
  )
}
