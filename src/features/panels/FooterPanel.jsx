/** Footer-editor — versie 1.0 | Laatst gewijzigd: 2026-11-16. Onderdelen, kleuren en links van de footer. */
import { Plus, Trash2 } from 'lucide-react'
import { LinkTargetField } from './LinkTargetField.jsx'

// Bewaart alles onder settings.footerConfig; de voettekst zelf blijft settings.footer.
export function FooterPanel({ site, change }) {
  const footer = site.settings?.footerConfig || {}
  const links = footer.links || []
  // Werkt de footerinstellingen bij zonder andere site-instellingen te raken.
  const patch = (value) =>
    change({ ...site, settings: { ...site.settings, footerConfig: { ...footer, ...value } } })
  return (
    <div className="settings-group">
      <h3>Footer</h3>
      {[
        ['show', 'Footer tonen'],
        ['showBrand', 'Woordmerk in footer tonen'],
        ['showYear', 'Jaartal tonen'],
      ].map(([key, label]) => (
        <label className="toggle-row" key={key}>
          {label}
          <input
            type="checkbox"
            checked={footer[key] !== false}
            onChange={(event) => patch({ [key]: event.target.checked })}
          />
        </label>
      ))}
      <label className="field">
        Voettekst
        <input
          value={site.settings?.footer || ''}
          onChange={(event) =>
            change({ ...site, settings: { ...site.settings, footer: event.target.value } })
          }
        />
      </label>
      <div className="field-row">
        <label className="field">
          Footerachtergrond
          <input
            type="color"
            value={footer.background || site.theme.background}
            onChange={(event) => patch({ background: event.target.value })}
          />
        </label>
        <label className="field">
          Footertekstkleur
          <input
            type="color"
            value={footer.color || site.theme.foreground}
            onChange={(event) => patch({ color: event.target.value })}
          />
        </label>
      </div>
      <button className="text-button" onClick={() => patch({ background: '', color: '' })}>
        Themakleuren voor footer
      </button>
      {links.map((item) => (
        <div className="submenu-editor footer-link-editor" key={item.id}>
          <input
            aria-label="Footerlink label"
            value={item.label}
            onChange={(event) =>
              patch({
                links: links.map((entry) =>
                  entry.id === item.id ? { ...entry, label: event.target.value } : entry
                ),
              })
            }
          />
          <LinkTargetField
            name="Footerlink"
            item={item}
            site={site}
            onChange={(value) =>
              patch({
                links: links.map((entry) =>
                  entry.id === item.id ? { ...entry, ...value } : entry
                ),
              })
            }
          />
          <button
            className="icon-button danger"
            aria-label={`Verwijder footerlink ${item.label}`}
            onClick={() => patch({ links: links.filter((entry) => entry.id !== item.id) })}
          >
            <Trash2 size={12} />
          </button>
        </div>
      ))}
      <button
        className="text-button"
        onClick={() =>
          patch({
            links: [
              ...links,
              {
                id: crypto.randomUUID(),
                label: 'Nieuwe link',
                kind: 'page',
                pageId: site.pages[0].id,
              },
            ],
          })
        }
      >
        <Plus size={12} />
        Footerlink toevoegen
      </button>
    </div>
  )
}
