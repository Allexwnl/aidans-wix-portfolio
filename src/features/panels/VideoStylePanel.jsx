/** Filmregie — versie 1.0 | Laatst gewijzigd: 2026-10-29. Presentatie zonder programmeren. */
// Filmstijl en afspeelwijze blijven los zodat elke combinatie mogelijk is.
export function VideoStylePanel({ block, update }) {
  return (
    <div className="settings-group">
      <h3>Filmische presentatie</h3>
      <button
        className="button secondary wide"
        onClick={() =>
          update({
            videoStyle: 'project',
            presentation: 'cinema',
            scrollEffect: 'expand',
            animation: 'iris',
            duration: 1200,
            ratio: '21 / 9',
            fullBleed: true,
            spacing: 35,
            pointerLabel: true,
          })
        }
      >
        Pas filmische projectstijl toe
      </button>
      <label className="field">
        Videostijl
        <select
          value={block.videoStyle || 'cover'}
          onChange={(event) => update({ videoStyle: event.target.value })}
        >
          <option value="cover">Omslag met titel in beeld</option>
          <option value="project">Rustig filmbeeld + projectgegevens</option>
          <option value="minimal">Alleen filmbeeld</option>
        </select>
      </label>
      <label className="field">
        Afspelen
        <select
          value={block.presentation || 'inline'}
          onChange={(event) => update({ presentation: event.target.value })}
        >
          <option value="inline">Op de pagina</option>
          <option value="cinema">In bioscoopvenster</option>
          <option value="muted">Op de pagina, starten zonder geluid</option>
        </select>
      </label>
      <label className="field">
        Beweging tijdens scrollen
        <select
          value={block.scrollEffect || 'none'}
          onChange={(event) => update({ scrollEffect: event.target.value })}
        >
          <option value="none">Geen</option>
          <option value="expand">Van kader naar breed filmbeeld</option>
          <option value="parallax">Langzaam verschuivende poster</option>
        </select>
      </label>
      <label className="toggle-row">
        Volgend kijklabel op desktop
        <input
          type="checkbox"
          checked={!!block.pointerLabel}
          onChange={(event) => update({ pointerLabel: event.target.checked })}
        />
      </label>
      <p className="helper-text">
        Ook op mobiel blijft een zichtbare afspeelknop. Films starten na een klik; de poster kan
        tijdens het scrollen bewegen.
      </p>
    </div>
  )
}
