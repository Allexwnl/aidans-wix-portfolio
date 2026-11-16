/** Instellingen — versie 1.1 | Laatst gewijzigd: 2026-11-16. Opslagmodus, export en herstel. */
import { Download, RotateCcw, Upload, ExternalLink } from 'lucide-react'
import { firebaseReady } from '../../services/firebase.js'

// Verzamelt expliciete concept- en herstelacties buiten de dagelijkse inhoudsbediening.
export function SettingsPanel({ model, action }) {
  return (
    <>
      <div className="panel-heading">
        <span className="eyebrow">ALLES OP ZIJN PLEK</span>
        <h2>Instellingen</h2>
        <p>
          {firebaseReady ? 'Verbonden met Firebase.' : 'Lokale proef: opgeslagen in deze browser.'}
        </p>
      </div>
      <div className="settings-group">
        <h3>Opslaan</h3>
        <label className="toggle-row">
          Autosave concept
          <input
            type="checkbox"
            checked={model.autosave}
            onChange={(event) => model.setAutosave(event.target.checked)}
          />
        </label>
        <p className="helper-text">
          {model.autosave
            ? 'Je wijzigingen worden na een korte pauze als concept opgeslagen.'
            : 'Je kiest zelf wanneer je het concept opslaat.'}{' '}
          Publiceren blijft altijd een aparte actie.
        </p>
        <button className="button secondary wide" onClick={() => action('save')}>
          Concept nu opslaan
        </button>
      </div>
      <div className="settings-group">
        <h3>Publicatie</h3>
        <p className="helper-text">
          {model.liveAt
            ? `Laatst gepubliceerd: ${new Date(model.liveAt).toLocaleString('nl-NL')}`
            : 'Nog niet gepubliceerd.'}
        </p>
        {/* Maakt zichtbaar of het concept afwijkt van de hoofdwebsite. */}
        {model.liveAt && (
          <p className="helper-text publish-note">
            {model.unpublished
              ? 'Je concept bevat wijzigingen die nog niet live staan.'
              : 'De hoofdwebsite is gelijk aan je concept.'}
          </p>
        )}
        <a className="button secondary wide" href="/" target="_blank" rel="noreferrer">
          Hoofdwebsite openen
          <ExternalLink size={12} />
        </a>
        <button className="text-button" onClick={() => action('restore')}>
          <RotateCcw size={13} />
          Vorige publicatie herstellen
        </button>
      </div>
      <div className="settings-group">
        <h3>Een kopie van je werk</h3>
        <button className="button secondary wide" onClick={() => action('export')}>
          <Download size={13} />
          Website exporteren
        </button>
        <label className="button secondary wide file-label">
          <Upload size={13} />
          Website importeren
          <input
            type="file"
            accept="application/json,.json"
            onChange={(event) => action('import', event.target.files?.[0])}
          />
        </label>
        <p className="helper-text">
          JSON bevat je pagina's en verwijzingen. Externe foto's en video's worden niet mee
          gedownload.
        </p>
      </div>
      <div className="settings-group">
        <h3>Opnieuw beginnen</h3>
        <button className="text-button" onClick={() => action('empty')}>
          Nieuwe lege website maken
        </button>
        <button className="text-button" onClick={() => action('template')}>
          Filmisch startontwerp laden
        </button>
        <p className="helper-text">
          Vervangt het concept. Je kunt dit ongedaan maken; de live website blijft staan.
        </p>
      </div>
    </>
  )
}
