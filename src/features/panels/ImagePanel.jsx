/** Afbeeldingspaneel — versie 1.0 | Laatst gewijzigd: 2026-11-16. Alttekst, verhouding, uitsnede, focuspunt en label. */
import { imageRatios, photoLabels } from '../../lib/images.js'

// Bewerkt de instellingen van één afbeelding; onChange krijgt het volledige nieuwe instellingenobject.
export function ImagePanel({ settings = {}, onChange, fallbackAlt = '' }) {
  // Wijzigt één veld en laat de overige instellingen staan.
  const set = (key, value) => onChange({ ...settings, [key]: value })
  return (
    <div className="image-settings">
      <label className="field">
        Alttekst
        <input
          placeholder={fallbackAlt || 'Beschrijf wat er op de foto staat'}
          value={settings.alt ?? ''}
          onChange={(event) => set('alt', event.target.value)}
        />
        <small>Voor schermlezers en zoekmachines. Leeg laten bij puur decoratief beeld.</small>
      </label>
      <div className="field-row">
        <label className="field">
          Verhouding
          <select
            value={settings.ratio || 'auto'}
            onChange={(event) => set('ratio', event.target.value)}
          >
            {imageRatios.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </label>
        <label className="field">
          Passend maken
          <select
            value={settings.fit || 'cover'}
            onChange={(event) => set('fit', event.target.value)}
          >
            <option value="cover">Vullen (uitsnede)</option>
            <option value="contain">Hele foto tonen</option>
          </select>
        </label>
      </div>
      <label className="field">
        Focuspunt horizontaal
        <input
          type="range"
          min="0"
          max="100"
          value={settings.focusX ?? 50}
          onChange={(event) => set('focusX', Number(event.target.value))}
        />
        <span>{settings.focusX ?? 50}%</span>
      </label>
      <label className="field">
        Focuspunt verticaal
        <input
          type="range"
          min="0"
          max="100"
          value={settings.focusY ?? 50}
          onChange={(event) => set('focusY', Number(event.target.value))}
        />
        <span>{settings.focusY ?? 50}%</span>
      </label>
      <label className="field">
        Fotolabel
        <select value={settings.label || ''} onChange={(event) => set('label', event.target.value)}>
          {photoLabels.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
