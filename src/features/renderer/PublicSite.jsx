/** Bezoekerssite — versie 2.0 | Laatst gewijzigd: 2026-11-04. Leest uitsluitend de live publicatie. */
import { useEffect, useState } from 'react'
import { loadDocument } from '../../services/storage.js'
import { firebaseReady, localDemo } from '../../services/firebase.js'
import { sitePath } from '../../lib/navigation.js'
import { initialSite } from '../../data/initialSite.js'
import { SiteRenderer } from './SiteRenderer.jsx'
import siteCss from './site.css?inline'

// De lokale startdemo staat los van een echte Firebase-publicatie.
export function PublicSite() {
  const [pathname, setPathname] = useState(location.pathname)
  useEffect(() => {
    const update = () => setPathname(location.pathname)
    window.addEventListener('popstate', update)
    return () => window.removeEventListener('popstate', update)
  }, [])
  const [state, setState] = useState({ site: null, error: '', loading: true })
  useEffect(() => {
    let active = true
    const timeout = setTimeout(() => {
      if (active)
        setState({
          site: null,
          error: 'De online opslag reageert niet. Probeer het later opnieuw.',
          loading: false,
        })
    }, 12000)
    loadDocument('live')
      .then((release) => {
        clearTimeout(timeout)
        if (active)
          setState({
            site: release?.site || (!firebaseReady ? initialSite : null),
            error: '',
            loading: false,
          })
      })
      .catch(() => {
        clearTimeout(timeout)
        if (active)
          setState({
            site: null,
            error: 'De website kan nu niet worden geladen. Probeer het later opnieuw.',
            loading: false,
          })
      })
    return () => {
      clearTimeout(timeout)
      active = false
    }
  }, [])
  let slug = pathname.replace(/^\/+|\/+$/g, '')
  try {
    slug = decodeURIComponent(slug)
  } catch {
    slug = '__invalid__'
  }
  const page = state.site?.pages.find((item) => item.slug === slug)
  useEffect(() => {
    if (page) document.title = `${page.title} — ${state.site.name}`
  }, [page, state.site])
  if (state.loading) return <main className="entry">Een moment…</main>
  if (state.error || !state.site)
    return (
      <main className="entry">
        <h1>Binnenkort meer.</h1>
        <p>{state.error || 'Deze website is nog niet gepubliceerd.'}</p>
        <a href="/studio">Naar de studio →</a>
      </main>
    )
  if (!page)
    return (
      <main className="entry">
        <h1>Deze pagina bestaat niet.</h1>
        <a href={sitePath()}>Terug naar home →</a>
      </main>
    )
  return (
    <>
      <style>{siteCss}</style>
      {!firebaseReady && (
        <a className="demo-badge" href={localDemo ? '/studio?demo=1' : '/studio'}>
          Lokale demo · Open de studio ↗
        </a>
      )}
      <SiteRenderer
        site={state.site}
        pageId={page.id}
        onNavigate={(id) => {
          const destination = state.site.pages.find((item) => item.id === id)
          if (!destination || destination.slug === slug) return
          history.pushState(null, '', sitePath(destination.slug))
          setPathname(location.pathname)
        }}
      />
    </>
  )
}
