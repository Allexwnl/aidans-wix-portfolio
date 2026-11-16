/** Sitelink — versie 1.0 | Laatst gewijzigd: 2026-11-16. Eén link voor menu en footer: pagina, sectie of extern. */
import { linkHref } from '../../lib/links.js'

// Interne klikken gebruiken de paginaovergang; externe en gemodificeerde klikken behouden hun URL.
export function SiteLink({ item, site, onNavigate, close }) {
  const external = item.kind === 'url'
  const href = linkHref(item, site)
  return (
    <a
      href={href}
      // Alleen webadressen openen in een nieuw tabblad; mailto en tel blijven in hetzelfde venster.
      target={external && href.startsWith('https:') ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
      onClick={
        onNavigate && !external
          ? (event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
              event.preventDefault()
              onNavigate(item.pageId, item.kind === 'section' ? item.sectionId : '')
              close?.()
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
