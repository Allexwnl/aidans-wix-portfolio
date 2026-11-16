/** Mediabibliotheek — versie 1.0 | Laatst gewijzigd: 2026-10-29. Lokale voorbeelden en GitHub-upload. */
import { useEffect, useState } from 'react'
import { ImagePlus, Upload, ArrowUpRight } from 'lucide-react'
import { uploadImage, listImages } from '../../services/media.js'
import { firebaseReady } from '../../services/firebase.js'
import { VideoExportPanel } from './VideoExportPanel.jsx'
import { StorageSources } from './StorageSources.jsx'

const examples = [
  { url: '/images/coast.jpg', name: 'Kustlijn' },
  { url: '/images/building.jpg', name: 'Architectuur' },
  { url: '/images/forest.jpg', name: 'In het groen' },
]

// Toont expliciet welke beelden lokaal zijn en geeft uploadfouten herstelbaar weer.
export function MediaPanel({ action }) {
  const [assets, setAssets] = useState(() =>
    JSON.parse(localStorage.getItem('aidan:media') || '[]')
  )
  const [status, setStatus] = useState('')
  const [url, setUrl] = useState('')
  const [busy, setBusy] = useState(false)
  const [source, setSource] = useState(localStorage.getItem('aidan:media-source') || '')
  useEffect(() => {
    let active = true
    localStorage.setItem('aidan:media-source', source)
    listImages(source)
      .then((items) => {
        if (active && items) setAssets(items)
      })
      .catch((error) => {
        if (active) setStatus(error.message)
      })
    return () => {
      active = false
    }
  }, [source])
  // Uploadt één foto via de beveiligde server; de private GitHub-token blijft buiten de browser.
  const upload = async (file) => {
    if (!file) return
    setBusy(true)
    setStatus('Foto voorbereiden en uploaden…')
    try {
      const asset = await uploadImage(file, source)
      const next = [...assets, asset]
      setAssets(next)
      localStorage.setItem('aidan:media', JSON.stringify(next))
      setStatus('Foto geüpload. Klik op de foto om hem te gebruiken.')
    } catch (error) {
      setStatus(error.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <>
      <div className="panel-heading">
        <span className="eyebrow">JE BEELDEN, BIJ ELKAAR</span>
        <h2>Mediabibliotheek</h2>
        <p>Selecteer een beeld om het op de gekozen bouwsteen toe te passen.</p>
      </div>
      <label className={`upload-zone ${busy ? 'disabled' : ''}`}>
        <Upload size={22} />
        <strong>{busy ? 'Even wachten…' : 'Foto toevoegen'}</strong>
        <span>JPEG, PNG of WebP · maximaal 8 MB</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          disabled={busy}
          onChange={(event) => upload(event.target.files?.[0])}
        />
      </label>
      <p className="helper-text">
        {firebaseReady
          ? 'Foto’s worden openbaar opgeslagen in de gekoppelde mediarepository.'
          : 'GitHub-upload vraagt een Firebase-login en een ingestelde mediakoppeling. De voorbeeldbeelden werken lokaal.'}
      </p>
      {status && (
        <p className="media-status" role="status">
          {status}
        </p>
      )}
      <label className="field">
        Of een bestaande HTTPS-afbeelding
        <input
          value={url}
          placeholder="https://…"
          onChange={(event) => setUrl(event.target.value)}
        />
      </label>
      <button
        className="button secondary wide"
        onClick={() => {
          if (!url.startsWith('https://'))
            return setStatus('Gebruik een openbare HTTPS-afbeelding.')
          action('media', url)
        }}
      >
        <ImagePlus size={13} />
        Afbeelding gebruiken
      </button>
      <div className="settings-group">
        <h3>
          Voorbeeldbeelden <span>3</span>
        </h3>
        <div className="media-grid">
          {[...assets, ...examples].map((asset) => (
            <button key={asset.url} onClick={() => action('media', asset.url)}>
              <img src={asset.url} alt={asset.name} />
              <span>
                {asset.name}
                <ArrowUpRight size={11} />
              </span>
            </button>
          ))}
        </div>
      </div>
      <p className="helper-text">
        De voorbeeldbeelden zijn startmateriaal. Vervang ze door Aidans eigen werk.
      </p>
      <StorageSources source={source} onChange={setSource} />
      <VideoExportPanel />
    </>
  )
}
