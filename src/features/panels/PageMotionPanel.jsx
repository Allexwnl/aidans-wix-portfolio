/** Overgangregie — versie 1.0 | Laatst gewijzigd: 2026-10-29. Globaal gedrag tussen pagina's. */
export function PageMotionPanel({ site, change }) {
  // Elke wijziging bewaart alle overige thema- en websiteinstellingen.
  const update = (patch) =>
    change((current) => ({ ...current, settings: { ...current.settings, ...patch } }))
  return (
    <div className="settings-group">
      <h3>Paginaovergangen</h3>
      <label className="field">
        Overgang tussen pagina’s
        <select
          value={site.settings?.pageTransition || 'none'}
          onChange={(event) => update({ pageTransition: event.target.value })}
        >
          <option value="none">Direct</option>
          <option value="fade">Zachte vervaging</option>
          <option value="curtain">Filmdoek omhoog</option>
          <option value="slide-left">Filmdoek naar links</option>
          <option value="slide-right">Filmdoek naar rechts</option>
        </select>
      </label>
      <label className="field">
        Duur per helft (ms)
        <input
          type="range"
          min="150"
          max="1000"
          step="50"
          value={site.settings?.transitionDuration || 450}
          onChange={(event) => update({ transitionDuration: Number(event.target.value) })}
        />
        <span>{site.settings?.transitionDuration || 450} ms</span>
      </label>
      <label className="field">
        Kleur overgang
        <input
          type="color"
          value={site.settings?.transitionColor || '#23251f'}
          onChange={(event) => update({ transitionColor: event.target.value })}
        />
      </label>
      <p className="helper-text">
        Bekijk via de navigatie in Voorbeeld. Werkt ook op mobiel en schakelt direct bij minder
        beweging.
      </p>
    </div>
  )
}
