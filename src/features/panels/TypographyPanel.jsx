/** Tekstvormgeving — versie 1.0 | Laatst gewijzigd: 2026-10-29. Per tekstveld en apparaat. */
import { useState } from 'react'

// Opmaak per veld voorkomt dat een bijschriftwijziging ook de hoofdtitel verandert.
export function TypographyPanel({ block, update, device, fonts }) {
  const [field, setField] = useState('title')
  const mobile = device === 'mobile'
  const source = mobile ? block.mobile : block
  const typography = {
    ...block.typography?.[field],
    ...(mobile ? block.mobile?.typography?.[field] : {}),
  }
  const patch = (values) => {
    const next = { ...source?.typography, [field]: { ...source?.typography?.[field], ...values } }
    update(mobile ? { mobile: { ...block.mobile, typography: next } } : { typography: next })
  }
  return (
    <div className="settings-group">
      <h3>
        Tekstopmaak <span>{mobile ? 'MOBIEL' : 'DESKTOP'}</span>
      </h3>
      <label className="field">
        Tekstveld
        <select value={field} onChange={(event) => setField(event.target.value)}>
          <option value="title">Titel</option>
          <option value="text">Tekst</option>
          <option value="caption">Bijschrift / introductie</option>
        </select>
      </label>
      <label className="field">
        Lettertype voor tekst
        <select
          value={typography.fontFamily || ''}
          onChange={(event) => patch({ fontFamily: event.target.value })}
        >
          <option value="">Themalettertype</option>
          {['Arial', 'Georgia', 'Verdana', 'Courier New'].map((font) => (
            <option key={font}>{font}</option>
          ))}
          {fonts.map((font) => (
            <option key={font.id} value={font.family}>
              {font.name}
            </option>
          ))}
        </select>
      </label>
      <div className="field-row">
        {[
          ['fontSize', 'Grootte (px)', 8, 300, 1],
          ['lineHeight', 'Regelhoogte', 0.7, 4, 0.05],
          ['letterSpacing', 'Letterafstand (px)', -10, 50, 0.1],
        ].map(([key, label, min, max, step]) => (
          <label className="field" key={key}>
            {label}
            <input
              type="number"
              min={min}
              max={max}
              step={step}
              placeholder="Auto"
              value={typography[key] ?? ''}
              onChange={(event) =>
                patch({
                  [key]:
                    event.target.value === ''
                      ? ''
                      : Math.min(max, Math.max(min, Number(event.target.value))),
                })
              }
            />
          </label>
        ))}
      </div>
      <label className="field">
        Dikte
        <select
          value={typography.fontWeight || ''}
          onChange={(event) => patch({ fontWeight: event.target.value })}
        >
          <option value="">Automatisch</option>
          {[300, 400, 500, 600, 700, 800, 900].map((weight) => (
            <option key={weight} value={weight}>
              {weight}
            </option>
          ))}
        </select>
      </label>
      <div className="segmented">
        {[
          ['fontStyle', 'italic', 'Cursief'],
          ['textDecoration', 'underline', 'Onderstrepen'],
          ['textTransform', 'uppercase', 'Hoofdletters'],
        ].map(([key, value, label]) => (
          <button
            key={key}
            aria-pressed={typography[key] === value}
            className={typography[key] === value ? 'active' : ''}
            onClick={() =>
              patch({
                [key]:
                  typography[key] === value ? (key === 'fontStyle' ? 'normal' : 'none') : value,
              })
            }
          >
            {label}
          </button>
        ))}
      </div>
      <label className="field">
        Tekstkleur
        <input
          type="color"
          value={typography.color || block.color || '#23251f'}
          onChange={(event) => patch({ color: event.target.value })}
        />
      </label>
      <label className="field">
        Tekstuitlijning
        <select
          value={typography.textAlign || ''}
          onChange={(event) => patch({ textAlign: event.target.value })}
        >
          <option value="">Overnemen</option>
          <option value="left">Links</option>
          <option value="center">Midden</option>
          <option value="right">Rechts</option>
          <option value="justify">Uitvullen</option>
        </select>
      </label>
      <button
        className="text-button"
        onClick={() => {
          const next = { ...source?.typography, [field]: {} }
          update(mobile ? { mobile: { ...block.mobile, typography: next } } : { typography: next })
        }}
      >
        Opmaak van dit tekstveld herstellen
      </button>
      <p className="helper-text">
        Selecteer woorden in het canvas voor vet, cursief, onderstrepen en links. Plakken neemt
        alleen tekst over.
      </p>
    </div>
  )
}
