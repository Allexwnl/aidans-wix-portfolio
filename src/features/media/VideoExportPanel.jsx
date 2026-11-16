/** Exportpaneel — versie 1.0 | Laatst gewijzigd: 2026-10-29. Bestand, resolutie, voortgang en download. */
import { useEffect, useRef, useState } from 'react'
import { Download, Film, X } from 'lucide-react'
import { convertVideo } from '../../services/videoExport.js'

// Bronbestanden blijven op de computer; de export kan daarna naar YouTube worden geüpload.
export function VideoExportPanel() {
  const [file, setFile] = useState(null)
  const [height, setHeight] = useState(720)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState({ percent: 0, message: '' })
  const [result, setResult] = useState('')
  const abort = useRef(null)
  useEffect(() => () => abort.current?.abort(), [])
  useEffect(
    () => () => {
      if (result) URL.revokeObjectURL(result)
    },
    [result]
  )
  // Start één export en laat mislukking of annulering altijd herkenbaar achter.
  const run = async () => {
    const controller = new AbortController()
    abort.current = controller
    setBusy(true)
    setResult('')
    try {
      const blob = await convertVideo(file, height, setProgress, controller.signal)
      setResult(URL.createObjectURL(blob))
    } catch (error) {
      setProgress({
        percent: 0,
        message: controller.signal.aborted
          ? 'Export geannuleerd.'
          : error.message || 'Export mislukt. Probeer een kleiner bestand.',
      })
    } finally {
      setBusy(false)
    }
  }
  return (
    <div className="settings-group video-export-panel">
      <h3>
        <Film size={13} />
        Video-export
      </h3>
      <p className="helper-text">
        Maak lokaal een MP4-versie in de gewenste resolutie. Je bestand wordt niet naar onze server
        gestuurd. Eerste gebruik downloadt een rekenmodule.
      </p>
      <label className="field">
        Origineel videobestand
        <input
          type="file"
          accept="video/*"
          disabled={busy}
          onChange={(event) => {
            setFile(event.target.files?.[0] || null)
            setResult('')
          }}
        />
      </label>
      <label className="field">
        Exportresolutie
        <select
          value={height}
          disabled={busy}
          onChange={(event) => {
            setHeight(Number(event.target.value))
            setResult('')
          }}
        >
          <option value="480">480p — klein bestand</option>
          <option value="720">720p — compact HD</option>
          <option value="1080">1080p — Full HD</option>
        </select>
      </label>
      <p className="helper-text">
        Tot 120 MB per bronbestand. Vooral voor korte clips op desktop. Vergroten voegt geen echte
        details toe.
      </p>
      <button className="button secondary wide" disabled={!file || busy} onClick={run}>
        {busy ? 'Video verwerken…' : 'MP4-versie maken'}
      </button>
      {busy && (
        <>
          <progress max="100" value={progress.percent} />
          <button className="text-button danger" onClick={() => abort.current?.abort()}>
            <X size={12} />
            Export annuleren
          </button>
        </>
      )}
      {progress.message && (
        <p className="helper-text" role="status">
          {progress.message}
        </p>
      )}
      {result && (
        <a
          className="button publish-button wide"
          href={result}
          download={`${file.name.replace(/\.[^.]+$/, '')}-${height}p.mp4`}
        >
          <Download size={13} />
          Download {height}p MP4
        </a>
      )}
      <p className="helper-text">
        Upload de export daarna naar YouTube en plak de link in je videoblok. De YouTube-speler
        bepaalt de afspeelkwaliteit.
      </p>
    </div>
  )
}
