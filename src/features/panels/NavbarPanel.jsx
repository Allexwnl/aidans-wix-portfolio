/** Navbarvormgeving — versie 1.0 | Laatst gewijzigd: 2026-11-04. Wisselbaar zonder links te verliezen. */
export function NavbarPanel({ site, change }) {
  const navbar = site.settings?.navbar || {}
  // Alleen presentatie verandert; pagina's en submenu's blijven dezelfde data gebruiken.
  const update = (patch) =>
    change((current) => ({
      ...current,
      settings: { ...current.settings, navbar: { ...current.settings?.navbar, ...patch } },
    }))
  return (
    <div className="settings-group">
      <h3>Navigatiestijl</h3>
      <label className="field">
        Navbarvariant
        <select
          value={navbar.variant || 'classic'}
          onChange={(event) => update({ variant: event.target.value })}
        >
          <option value="classic">Klassiek — logo links, menu rechts</option>
          <option value="centered">Gecentreerd — menu in het midden</option>
          <option value="floating">Zwevende afgeronde balk</option>
          <option value="compact">Compact — uitklapbaar menu</option>
        </select>
      </label>
      {[
        ['showBrand', 'Woordmerk tonen'],
        ['showLocation', 'Tekst naast logo tonen'],
        ['showArrows', 'Pijlen bij menulinks tonen'],
      ].map(([key, label]) => (
        <label className="toggle-row" key={key}>
          {label}
          <input
            type="checkbox"
            checked={navbar[key] !== false}
            onChange={(event) => update({ [key]: event.target.checked })}
          />
        </label>
      ))}
      <label className="toggle-row">
        Navigatie blijft in beeld
        <input
          type="checkbox"
          checked={!!site.settings?.stickyNav}
          onChange={(event) =>
            change((current) => ({
              ...current,
              settings: { ...current.settings, stickyNav: event.target.checked },
            }))
          }
        />
      </label>
      <div className="field-row">
        {[
          ['background', 'Achtergrond'],
          ['color', 'Tekstkleur'],
        ].map(([key, label]) => (
          <label key={key} className="field">
            {label}
            <input
              type="color"
              value={navbar[key] || site.theme[key === 'color' ? 'foreground' : 'background']}
              onChange={(event) => update({ [key]: event.target.value })}
            />
          </label>
        ))}
      </div>
      <button className="text-button" onClick={() => update({ background: '', color: '' })}>
        Themakleuren volgen
      </button>
    </div>
  )
}
