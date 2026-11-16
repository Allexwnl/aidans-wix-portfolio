/** Fontbeheer — versie 1.0 | Laatst gewijzigd: 2026-10-29. Uploads zonder externe fontdienst. */
import { useState } from 'react'
import { importFont, removeFont } from '../../lib/fonts.js'

// Fonts reizen mee met concept, export en publicatie; uploadstatus blijft zichtbaar.
export function FontPanel({ site, change }) {
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  return (
    <div className="settings-group">
      <h3>Eigen lettertypen</h3>
      <label className="field">
        Font uploaden
        <input
          type="file"
          accept=".woff2,.woff,.ttf,.otf"
          disabled={busy}
          onChange={async (event) => {
            const file = event.target.files?.[0]
            event.target.value = ''
            if (!file) return
            setBusy(true)
            setMessage('Lettertype controleren…')
            try {
              const font = await importFont(file, site.fonts)
              change((current) => ({ ...current, fonts: [...(current.fonts || []), font] }))
              setMessage(`${font.name} is beschikbaar in alle lettertypekeuzes.`)
            } catch (error) {
              setMessage(error.message)
            } finally {
              setBusy(false)
            }
          }}
        />
      </label>
      {message && (
        <p role="status" className="helper-text">
          {message}
        </p>
      )}
      {(site.fonts || []).map((font) => (
        <div className="font-entry" key={font.id}>
          <span>{font.name}</span>
          <button
            className="text-button danger"
            aria-label={`${font.name} verwijderen`}
            onClick={() => change((current) => removeFont(current, font.family))}
          >
            Verwijderen
          </button>
        </div>
      ))}
      <p className="helper-text">
        WOFF2, WOFF, TTF of OTF. Maximaal 1 MB per bestand, 3 MB samen. Fonts worden in je ontwerp
        bewaard. Gebruik fonts waarvoor je webrechten hebt.
      </p>
    </div>
  )
}
