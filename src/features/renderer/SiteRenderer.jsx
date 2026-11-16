/** Paginarenderer — versie 2.1 | Laatst gewijzigd: 2026-11-16. Gedeeld tussen canvas en bezoekerssite. */
import { useEffect, useRef } from 'react'
import { SiteFooter } from './SiteFooter.jsx'
import { useAnchorNavigation } from '../../hooks/useAnchorNavigation.js'
import { SiteHeader } from './SiteHeader.jsx'
import { NodeRenderer } from './NodeRenderer.jsx'
import { usePageTransition } from '../../hooks/usePageTransition.js'
import { useRevealMotion } from '../../hooks/useRevealMotion.js'
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
  // Een andere pagina begint bovenaan of bij de gekozen sectie; preview omschakelen behoudt de scrollpositie.
  const navigate = useAnchorNavigation(root, displayedId, pageId, onNavigate)
  const page = site.pages.find((item) => item.id === displayedId) || site.pages[0]
  // Start de animaties per trigger; compact meldt of de mobiele animatiewaarden gelden.
  const compact = useRevealMotion(root, editing, `${displayedId}-${replay}`, page.sections)
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
            {...{ block, editing, selected, onSelect, onEdit, site, compact }}
            onNavigate={navigate}
          />
        ))}
      </main>
      <SiteFooter site={site} onNavigate={navigate} />
    </div>
  )
}
