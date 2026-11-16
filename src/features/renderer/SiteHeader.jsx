/** Navigatie — versie 2.0 | Laatst gewijzigd: 2026-11-04. Varianten delen links en mobiele bediening. */
import { useEffect, useRef, useState } from 'react'
import { sitePath } from '../../lib/navigation.js'

// Dezelfde navigatiedata werkt in alle stijlen; Escape sluit geopende menu's.
export function SiteHeader({ site, onNavigate }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const navbar = site.settings?.navbar || {}
  useEffect(() => {
    const element = root.current
    const document = element.ownerDocument
    const close = (event) => {
      if (event.key !== 'Escape') return
      if (element.querySelector('.navigation-open') || element.querySelector('details[open]')) {
        setOpen(false)
        element.querySelectorAll('details[open]').forEach((menu) => {
          menu.open = false
        })
        element.querySelector('.mobile-menu')?.focus()
      }
    }
    document.addEventListener('keydown', close)
    return () => document.removeEventListener('keydown', close)
  }, [])
  return (
    <header
      ref={root}
      className={`site-header navbar-${navbar.variant || 'classic'} ${navbar.showArrows === false ? 'nav-no-arrows' : ''} ${site.settings?.stickyNav ? 'sticky-nav' : ''}`}
      style={{ background: navbar.background || undefined, color: navbar.color || undefined }}
    >
      {navbar.showBrand !== false && (
        <a
          className="site-wordmark"
          href={sitePath()}
          onClick={
            onNavigate
              ? (event) => {
                  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
                  event.preventDefault()
                  onNavigate(site.pages.find((page) => page.slug === '')?.id || site.pages[0].id)
                  setOpen(false)
                }
              : undefined
          }
        >
          {site.name.toLowerCase()}
          <sup>®</sup>
        </a>
      )}
      {navbar.showLocation !== false && (
        <span className="site-location">
          {site.settings?.location || 'Onafhankelijk filmmaker\nNederland, beschikbaar overal.'}
        </span>
      )}
      <button
        type="button"
        className="mobile-menu"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
      >
        {open ? 'Sluiten −' : 'Menu +'}
      </button>
      <nav aria-label="Hoofdnavigatie" className={open ? 'navigation-open' : ''}>
        {site.navigation.map((item) =>
          item.children?.length ? (
            <details key={item.id}>
              <summary>{item.label} +</summary>
              <div className="site-submenu">
                {item.children.map((child) => (
                  <NavLink
                    key={child.id}
                    item={child}
                    site={site}
                    onNavigate={onNavigate}
                    close={() => setOpen(false)}
                  />
                ))}
              </div>
            </details>
          ) : (
            <NavLink key={item.id} {...{ item, site, onNavigate }} close={() => setOpen(false)} />
          )
        )}
      </nav>
    </header>
  )
}

// Gewone en gemodificeerde links behouden hun URL; interne klikken gebruiken de overgang.
function NavLink({ item, site, onNavigate, close }) {
  const page = site.pages.find((entry) => entry.id === item.pageId)
  return (
    <a
      href={sitePath(page?.slug || '')}
      onClick={
        onNavigate
          ? (event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
              event.preventDefault()
              onNavigate(item.pageId)
              close()
              const submenu = event.currentTarget.closest('details')
              if (submenu) submenu.open = false
            }
          : undefined
      }
    >
      {item.label}
      <span>↗</span>
    </a>
  )
}
