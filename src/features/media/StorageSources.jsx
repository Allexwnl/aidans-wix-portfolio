/** Opslagkeuze — versie 1.0 | Laatst gewijzigd: 2026-10-29. Nieuwe openbare opslagbron via dashboard. */
import { useEffect, useState } from 'react'
import { Plus, Database } from 'lucide-react'
import { sourceRequest } from '../../services/sources.js'

// Toont opslaggebruik en laat de klant bewust een nieuwe openbare fotobron toevoegen.
export function StorageSources({ source, onChange }) {
  const [sources, setSources] = useState([])
  const [name, setName] = useState('')
  const [creating, setCreating] = useState(false)
  const [accepted, setAccepted] = useState(false)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  useEffect(() => {
    let active = true
    sourceRequest()
      .then((data) => {
        if (!active) return
        setSources(data.sources)
        if (!source && data.sources[0]) onChange(data.sources[0].repository)
      })
      .catch(() => {})
    return () => {
      active = false
    }
  }, [source, onChange])
  // Een nieuwe bron wordt pas na expliciete keuze aangemaakt en wordt niet stil automatisch toegevoegd.
  const create = async () => {
    setBusy(true)
    setMessage('')
    try {
      const data = await sourceRequest(name)
      setSources([...sources, data.source])
      onChange(data.source.repository)
      setCreating(false)
      setName('')
      setAccepted(false)
      setMessage('Nieuwe opslagbron aangemaakt.')
    } catch (error) {
      setMessage(error.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="settings-group">
      <h3>
        <Database size={13} />
        Foto-opslag
      </h3>
      <label className="field">
        Actieve opslagbron
        <select value={source} onChange={(event) => onChange(event.target.value)}>
          <option value="">Kies een opslagbron</option>
          {sources.map((item) => (
            <option key={item.repository} value={item.repository}>
              {item.name} · {(item.sizeKb / 1024).toFixed(1)} MB
            </option>
          ))}
        </select>
      </label>
      <p className="helper-text">
        De grootte is een indicatie van GitHub, geen beschikbaar tegoed. Bestaande foto's blijven op
        hun huidige bron staan.
      </p>
      <button className="text-button" onClick={() => setCreating(!creating)}>
        <Plus size={12} />
        Nieuwe opslagbron
      </button>
      {creating && (
        <div className="source-create">
          <label className="field">
            Naam
            <input
              value={name}
              placeholder="bijvoorbeeld werk-2026"
              onChange={(event) =>
                setName(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
              }
              maxLength={60}
            />
          </label>
          <label className="source-consent">
            <input
              type="checkbox"
              checked={accepted}
              onChange={(event) => setAccepted(event.target.checked)}
            />
            Deze bron en alle foto's daarin zijn openbaar. Ik wil deze aanmaken.
          </label>
          <button
            className="button secondary wide"
            disabled={!accepted || !name || busy}
            onClick={create}
          >
            {busy ? 'Aanmaken…' : 'Opslagbron aanmaken'}
          </button>
        </div>
      )}
      {message && (
        <p className="helper-text" role="status">
          {message}
        </p>
      )}
    </div>
  )
}
