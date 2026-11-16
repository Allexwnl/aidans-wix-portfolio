/** Editorstate — versie 1.1 | Laatst gewijzigd: 2026-11-16. Historie, autosave en publiceren. */
import { useCallback, useEffect, useRef, useState } from 'react'
import { initialSite } from '../data/initialSite.js'
import { loadDocument, saveDocument, publishDocument } from '../services/storage.js'
import { validateSite as validateBeforePublish } from '../lib/validation.js'

// Beheert de werkversie; een enkele opslagwachtrij voorkomt overlappende writes.
export function useDocument() {
  const [history, setHistory] = useState({ past: [], site: initialSite, future: [] })
  const [ready, setReady] = useState(false)
  const [autosave, setAutosave] = useState(localStorage.getItem('aidan:autosave') !== 'false')
  const [status, setStatus] = useState('Concept laden…')
  const [error, setError] = useState('')
  const [liveAt, setLiveAt] = useState('')
  // Inhoud van de live release; hiermee is te zien of het concept nog niet gepubliceerd is.
  const [liveVersion, setLiveVersion] = useState('')
  const [savedVersion, setSavedVersion] = useState(JSON.stringify(initialSite))
  const revision = useRef(0)
  const saved = useRef(JSON.stringify(initialSite))
  const queue = useRef(Promise.resolve())
  const latest = useRef(history.site)
  const loaded = useRef(false)
  useEffect(() => {
    latest.current = history.site
  }, [history.site])
  useEffect(() => {
    let active = true
    Promise.all([loadDocument(), loadDocument('live')])
      .then(([draft, live]) => {
        if (!active) return
        if (draft?.site) {
          setHistory({ past: [], site: draft.site, future: [] })
          revision.current = draft.revision
          saved.current = JSON.stringify(draft.site)
          setSavedVersion(saved.current)
        }
        setLiveAt(live?.savedAt || '')
        setLiveVersion(live?.site ? JSON.stringify(live.site) : '')
        setStatus(draft ? 'Concept geladen' : 'Startontwerp · nog niet opgeslagen')
        setReady(true)
        loaded.current = true
      })
      .catch((reason) => {
        if (active) {
          setError(`Laden mislukt: ${reason.message}`)
          setStatus('Opslag niet beschikbaar')
        }
      })
    return () => {
      active = false
    }
  }, [])

  // Voegt een bewerking of een historiehandeling toe zonder oude snapshots te wijzigen.
  const change = useCallback((action) => {
    setHistory((current) => {
      if (action === 'undo')
        return current.past.length
          ? {
              past: current.past.slice(0, -1),
              site: current.past.at(-1),
              future: [current.site, ...current.future],
            }
          : current
      if (action === 'redo')
        return current.future.length
          ? {
              past: [...current.past, current.site],
              site: current.future[0],
              future: current.future.slice(1),
            }
          : current
      const site = typeof action === 'function' ? action(current.site) : action
      return { past: [...current.past.slice(-49), current.site], site, future: [] }
    })
  }, [])

  // Serialiseert writes; publiceren gebruikt precies de meegegeven snapshot.
  const persist = useCallback((site, publish = false) => {
    const task = queue.current
      .catch(() => {})
      .then(async () => {
        if (!loaded.current) throw new Error('Wacht tot je concept volledig is geladen.')
        setError('')
        setStatus(publish ? 'Publiceren…' : 'Concept opslaan…')
        if (publish) validateBeforePublish(site)
        // Een ongewijzigde versie hoeft niet nogmaals opgeslagen te worden.
        if (JSON.stringify(site) !== saved.current || revision.current === 0) {
          const result = await saveDocument(site, revision.current)
          revision.current = result.revision
          saved.current = JSON.stringify(site)
          setSavedVersion(saved.current)
        }
        if (publish) {
          const release = await publishDocument(site)
          setLiveAt(release.savedAt)
          setLiveVersion(JSON.stringify(site))
        }
        setStatus(publish ? 'Gepubliceerd' : 'Concept opgeslagen')
      })
      .catch((reason) => {
        setError(reason.message)
        setStatus('Niet opgeslagen')
        throw reason
      })
    queue.current = task
    return task
  }, [])

  useEffect(() => {
    localStorage.setItem('aidan:autosave', String(autosave))
    if (!ready || !autosave || JSON.stringify(history.site) === saved.current) return
    const timer = setTimeout(() => persist(history.site).catch(() => {}), 1000)
    return () => clearTimeout(timer)
  }, [history.site, autosave, ready, persist])
  useEffect(() => {
    const handler = (event) => {
      if (JSON.stringify(latest.current) !== saved.current) {
        event.preventDefault()
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [])
  // Eén serialisatie per render voor de opslag- en publicatiestatus.
  const current = JSON.stringify(history.site)
  return {
    ...history,
    change,
    ready,
    autosave,
    setAutosave,
    status,
    error,
    setError,
    liveAt,
    // Werkt de live-status bij na een release buiten persist om, zoals terugzetten.
    setLive: (release) => {
      setLiveAt(release.savedAt)
      setLiveVersion(JSON.stringify(release.site))
    },
    dirty: current !== savedVersion,
    // Waar zodra de werkversie afwijkt van wat bezoekers nu zien.
    unpublished: Boolean(liveVersion) && current !== liveVersion,
    persist,
  }
}
