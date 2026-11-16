/** Footer — versie 1.0 | Laatst gewijzigd: 2026-11-16. Woordmerk, tekst, links en kleuren uit de site-instellingen. */
import { SiteLink } from './SiteLink.jsx'

// Toont alleen de onderdelen die in de footerinstellingen aan staan.
export function SiteFooter({ site, onNavigate }) {
  const footer = site.settings?.footerConfig || {}
  if (footer.show === false) return null
  return (
    <footer
      className="site-footer"
      style={{ background: footer.background || undefined, color: footer.color || undefined }}
    >
      {footer.showBrand !== false && (
        <strong>
          {site.name.toLowerCase()}
          <span>®</span>
        </strong>
      )}
      <span>{site.settings?.footer || 'Verhalen in beeld.'}</span>
      {footer.links?.length > 0 && (
        <nav aria-label="Footernavigatie" className="footer-links">
          {footer.links.map((item) => (
            <SiteLink key={item.id} {...{ item, site, onNavigate }} />
          ))}
        </nav>
      )}
      {footer.showYear !== false && <span>© {new Date().getFullYear()}</span>}
    </footer>
  )
}
