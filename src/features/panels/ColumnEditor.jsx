/** Compositie-editor — versie 1.0 | Laatst gewijzigd: 2026-10-29. Bewerkbare inhoud en plaatsing in kolommen. */
import { Plus, Trash2 } from 'lucide-react'

// Laat de klant composities maken zonder code of een vaste portfoliotemplate.
export function ColumnEditor({ block, update, device }) {
  // Wijzigt één compositiecel; de overige cellen behouden hun inhoud.
  const patch = (id, values) =>
    update({ items: block.items.map((item) => (item.id === id ? { ...item, ...values } : item)) })
  return (
    <div className="settings-group">
      <h3>Compositie</h3>
      <label className="field">
        {device === 'mobile' ? 'Kolommen op mobiel' : 'Kolommen'}
        <select
          value={device === 'mobile' ? block.mobile?.columns || 1 : block.columns || 2}
          onChange={(event) =>
            update(
              device === 'mobile'
                ? { mobile: { ...block.mobile, columns: Number(event.target.value) } }
                : { columns: Number(event.target.value) }
            )
          }
        >
          {[1, 2, 3, 4].map((value) => (
            <option key={value} value={value}>
              {value}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Tussenruimte <span>{block.gap ?? 24}px</span>
        <input
          type="range"
          min="0"
          max="100"
          value={block.gap ?? 24}
          onChange={(event) => update({ gap: Number(event.target.value) })}
        />
      </label>
      {(block.items || []).map((item, index) => (
        <details key={item.id} className="item-editor">
          <summary>
            Element {index + 1} · {item.title || item.type}
          </summary>
          <label className="field">
            Soort
            <select
              value={item.type || 'text'}
              onChange={(event) => patch(item.id, { type: event.target.value })}
            >
              <option value="text">Tekst</option>
              <option value="image">Afbeelding</option>
              <option value="video">YouTube-video</option>
              <option value="button">Knop</option>
            </select>
          </label>
          <label className="field">
            Titel / alttekst
            <input
              value={item.title || ''}
              onChange={(event) => patch(item.id, { title: event.target.value })}
            />
          </label>
          {(!item.type || item.type === 'text') && (
            <label className="field">
              Tekst
              <textarea
                rows="4"
                value={item.text || ''}
                onChange={(event) => patch(item.id, { text: event.target.value })}
              />
            </label>
          )}
          {item.type === 'image' && (
            <label className="field">
              Afbeelding-URL
              <input
                value={item.image || ''}
                onChange={(event) => patch(item.id, { image: event.target.value })}
              />
            </label>
          )}
          {['button', 'video'].includes(item.type) && (
            <label className="field">
              Link
              <input
                value={item.url || ''}
                onChange={(event) => patch(item.id, { url: event.target.value })}
              />
            </label>
          )}
          <label className="field">
            Verticale uitlijning
            <select
              value={item.vertical || 'start'}
              onChange={(event) => patch(item.id, { vertical: event.target.value })}
            >
              <option value="start">Boven</option>
              <option value="center">Midden</option>
              <option value="end">Onder</option>
            </select>
          </label>
          <div className="field-row">
            <label className="field">
              Verschuiving X
              <input
                type="number"
                min="-500"
                max="500"
                value={(device === 'mobile' ? item.mobileOffsetX : item.offsetX) || 0}
                onChange={(event) =>
                  patch(item.id, {
                    [device === 'mobile' ? 'mobileOffsetX' : 'offsetX']: Number(event.target.value),
                  })
                }
              />
            </label>
            <label className="field">
              Verschuiving Y
              <input
                type="number"
                min="-500"
                max="500"
                value={(device === 'mobile' ? item.mobileOffsetY : item.offsetY) || 0}
                onChange={(event) =>
                  patch(item.id, {
                    [device === 'mobile' ? 'mobileOffsetY' : 'offsetY']: Number(event.target.value),
                  })
                }
              />
            </label>
          </div>
          <button
            className="text-button danger"
            onClick={() => update({ items: block.items.filter((entry) => entry.id !== item.id) })}
          >
            <Trash2 size={12} />
            Element verwijderen
          </button>
        </details>
      ))}
      <button
        className="add-section"
        onClick={() =>
          update({
            items: [
              ...(block.items || []),
              {
                id: crypto.randomUUID(),
                type: 'text',
                title: 'Een nieuw perspectief',
                text: 'Schrijf hier jouw verhaal.',
                image: '/images/forest.jpg',
              },
            ],
          })
        }
      >
        <Plus size={13} />
        Element toevoegen
      </button>
    </div>
  )
}
