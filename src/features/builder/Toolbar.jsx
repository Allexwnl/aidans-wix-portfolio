/** Werkbalk — versie 1.2 | Laatst gewijzigd: 2026-11-16. Preview, apparaatkeuze en opslag. */
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Eye,
  Monitor,
  Redo2,
  Save,
  Smartphone,
  Tablet,
  Undo2,
  ArrowLeft,
  LoaderCircle,
} from 'lucide-react'
import { firebaseReady } from '../../services/firebase.js'

// Houdt de belangrijkste handelingen altijd zichtbaar boven het canvas.
export function Toolbar({ model, page, preview, setPreview, device, setDevice, action, busy }) {
  return (
    <header className="studio-toolbar">
      <a className="studio-logo" href="/studio" aria-label="Aidan Studio">
        a<span>.</span>
      </a>
      <div className="toolbar-project">
        <strong>
          Aidan's portfolio <ChevronDown size={12} />
        </strong>
        <span>
          <i />
          {firebaseReady ? 'Firebase verbonden' : 'Lokale proefmodus'}
        </span>
      </div>
      <span className="toolbar-divider" />
      <span className="toolbar-page">
        {page.title}
        <span>/ {preview ? 'Voorbeeld' : 'Bewerken'}</span>
      </span>
      <div className="device-switch" aria-label="Apparaatvoorbeeld">
        <button
          aria-label="Desktopvoorbeeld"
          title="Desktop"
          className={device === 'desktop' ? 'active' : ''}
          onClick={() => setDevice('desktop')}
        >
          <Monitor size={16} />
        </button>
        <button
          aria-label="Tabletvoorbeeld"
          title="Tablet"
          className={device === 'tablet' ? 'active' : ''}
          onClick={() => setDevice('tablet')}
        >
          <Tablet size={16} />
        </button>
        <button
          aria-label="Mobiel voorbeeld"
          title="Mobiel"
          className={device === 'mobile' ? 'active' : ''}
          onClick={() => setDevice('mobile')}
        >
          <Smartphone size={16} />
        </button>
      </div>
      <div className="toolbar-right">
        <div className="history-buttons">
          <button
            className="icon-button"
            aria-label="Ongedaan maken"
            disabled={!model.past.length}
            onClick={() => model.change('undo')}
          >
            <Undo2 size={16} />
          </button>
          <button
            className="icon-button"
            aria-label="Opnieuw uitvoeren"
            disabled={!model.future.length}
            onClick={() => model.change('redo')}
          >
            <Redo2 size={16} />
          </button>
        </div>
        <span className="save-indicator" title={model.status}>
          {busy ? <LoaderCircle size={12} className="spin" /> : <Check size={12} />}
          {model.dirty ? 'Niet opgeslagen' : model.status}
        </span>
        {/* Toont of bezoekers de actuele werkversie al zien. */}
        <span className="publish-state">
          {!model.liveAt
            ? 'Nog niet gepubliceerd'
            : model.unpublished
              ? 'Wijzigingen nog niet live'
              : 'Live is actueel'}
        </span>
        <button className="button secondary preview-button" onClick={() => setPreview(!preview)}>
          {preview ? <ArrowLeft size={14} /> : <Eye size={14} />}
          {preview ? 'Bewerken' : 'Voorbeeld'}
        </button>
        {!model.autosave && (
          <button
            className="icon-button"
            title="Concept opslaan"
            aria-label="Concept opslaan"
            onClick={() => action('save')}
            disabled={busy}
          >
            <Save size={17} />
          </button>
        )}
        <button
          className="button publish-button"
          onClick={() => action('publish')}
          disabled={busy || !model.ready}
        >
          {busy ? 'Even wachten…' : 'Publiceren'}
          <ArrowUpRight size={15} />
        </button>
      </div>
    </header>
  )
}
