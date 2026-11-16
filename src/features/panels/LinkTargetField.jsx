/** Linkbestemming — versie 1.0 | Laatst gewijzigd: 2026-11-16. Kiest pagina, sectie of externe URL. */
import { linkKinds, listSections } from '../../lib/links.js'
import { safeUrl } from '../../lib/validation.js'

// Herbruikbaar voor menulinks, submenu's en footerlinks; onChange krijgt alleen de gewijzigde velden.
export function LinkTargetField({ item, site, onChange, name = 'Link' }) {
  const kind = item.kind || 'page'
  const page = site.pages.find((entry) => entry.id === item.pageId) || site.pages[0]
  return (
    <div className="link-target">
      <select
        aria-label={`${name} soort`}
        value={kind}
        onChange={(event) =>
          onChange({ kind: event.target.value, pageId: item.pageId || site.pages[0].id })
        }
      >
        {linkKinds.map(([id, label]) => (
          <option key={id} value={id}>
            {label}
          </option>
        ))}
      </select>
      {kind === 'url' ? (
        <>
          <input
            aria-label={`${name} adres`}
            placeholder="https://… of mailto:…"
            value={item.url || ''}
            onChange={(event) => onChange({ url: event.target.value })}
          />
          {item.url && !safeUrl(item.url) && (
            <small className="danger">Gebruik een https-, mailto- of tel-adres.</small>
          )}
        </>
      ) : (
        <select
          aria-label={`${name} pagina`}
          value={page.id}
          // Een andere pagina heeft andere secties; de oude sectiekeuze vervalt.
          onChange={(event) => onChange({ pageId: event.target.value, sectionId: '' })}
        >
          {site.pages.map((entry) => (
            <option key={entry.id} value={entry.id}>
              {entry.title}
            </option>
          ))}
        </select>
      )}
      {kind === 'section' && (
        <select
          aria-label={`${name} sectie`}
          value={item.sectionId || ''}
          onChange={(event) => onChange({ sectionId: event.target.value })}
        >
          <option value="">Kies een sectie…</option>
          {listSections(page.sections).map((section) => (
            <option key={section.id} value={section.id}>
              {section.label}
            </option>
          ))}
        </select>
      )}
    </div>
  )
}
