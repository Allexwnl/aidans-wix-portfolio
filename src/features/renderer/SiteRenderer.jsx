/** Paginarenderer — versie 2.0 | Laatst gewijzigd: 2026-11-04. Gedeeld tussen canvas en bezoekerssite. */
import { useEffect, useRef } from 'react'
import { SiteHeader } from './SiteHeader.jsx'
import { NodeRenderer } from './NodeRenderer.jsx'
import { usePageTransition } from '../../hooks/usePageTransition.js'
import { FontLoader } from './FontLoader.jsx'
import { IntroOverlay } from './IntroOverlay.jsx'

// Renderert alleen toegestane bouwstenen en geeft wijzigingen terug aan de editor.
export function SiteRenderer({
  site,
  pageId,
  editing = false,
  selected,
  onSelect,
  onEdit,
  onNavigate,
  replay = 0,
}) {
  const root = useRef(null)
  const displayedId = usePageTransition(root, pageId, site.settings, editing)
  const navigate = onNavigate
  const page = site.pages.find((item) => item.id === displayedId) || site.pages[0]
  // Een andere pagina begint bovenaan; alleen preview omschakelen behoudt de scrollpositie.
  useEffect(() => {
    root.current?.ownerDocument.defaultView.scrollTo({ top: 0, behavior: 'instant' })
  }, [displayedId])
  useEffect(() => {
    const Observer = root.current?.ownerDocument.defaultView.IntersectionObserver
    if (!Observer) return
    const observer = new Observer(
      (entries) =>
        entries.forEach((entry) => {
          const motion = entry.target.querySelector(':scope > .node-motion')
          if (!motion) return
          if (entry.isIntersecting) {
            motion.classList.add('in-view')
            if (!motion.dataset.repeat) observer.unobserve(entry.target)
          } else if (motion.dataset.repeat) {
            motion.classList.remove('in-view')
          }
        }),
      { threshold: 0, rootMargin: '0px 0px -24px 0px' }
    )
    root.current.querySelectorAll('.node-section').forEach((node) => observer.observe(node))
    return () => observer.disconnect()
  }, [displayedId, replay, page.sections, editing])
  useEffect(() => {
    if (!editing || !selected) return
    const node = root.current?.querySelector(`[data-section-id="${CSS.escape(selected)}"]`)
    if (!node) return
    const bounds = node.getBoundingClientRect()
    if (bounds.top > node.ownerDocument.defaultView.innerHeight - 80 || bounds.bottom < 80)
      node.scrollIntoView({
        behavior: node.ownerDocument.defaultView.matchMedia('(prefers-reduced-motion: reduce)')
          .matches
          ? 'instant'
          : 'smooth',
        block: 'start',
      })
  }, [selected, editing])
  return (
    <div
      ref={root}
      className="portfolio"
      style={{
        '--site-bg': site.theme.background,
        '--site-fg': site.theme.foreground,
        '--site-accent': site.theme.accent,
        '--site-font': site.theme.font,
        '--site-radius': `${site.theme.radius}px`,
      }}
    >
      <FontLoader fonts={site.fonts} root={root} />
      {!editing && site.settings?.intro && <IntroOverlay text={site.settings.introText} />}
      <SiteHeader site={site} onNavigate={navigate} />
      <main tabIndex={-1} className="page-content" key={`${displayedId}-${replay}`}>
        {page.sections.length === 0 && (
          <div className="blank-page">
            <span>Een leeg canvas. Alle ruimte.</span>
            <p>Voeg een bouwsteen toe om te beginnen.</p>
          </div>
        )}
        {page.sections.map((block) => (
          <NodeRenderer
            key={block.id}
            {...{ block, editing, selected, onSelect, onEdit, site }}
            onNavigate={navigate}
          />
        ))}
      </main>
      <footer className="site-footer">
        <strong>
          {site.name.toLowerCase()}
          <span>®</span>
        </strong>
        <span>{site.settings?.footer || 'Verhalen in beeld.'}</span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}
