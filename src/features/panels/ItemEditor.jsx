/** Media-items — versie 1.1 | Laatst gewijzigd: 2026-11-16. Projecten en carouselfoto's bewerken. */
import { Plus, Trash2, ArrowUp } from 'lucide-react'
import { ImagePanel } from './ImagePanel.jsx'

// Bewerkt items binnen een raster/carousel; schoolindeling is optioneel per project.
export function ItemEditor({ block, update, pages = [], action }) {
  // Werkt één item bij zonder andere items te muteren.
  const patch = (id, value) =>
    update({ items: block.items.map((item) => (item.id === id ? { ...item, ...value } : item)) })
  return (
    <div className="settings-group">
      <h3>
        {block.type === 'grid' ? 'Projecten' : 'Foto’s'} <span>{block.items?.length || 0}</span>
      </h3>
      {(block.items || []).map((item, index) => (
        <details className="item-editor" key={item.id}>
          <summary>{item.title || `Item ${index + 1}`}</summary>
          <label className="field">
            Titel
            <input
              value={item.title || ''}
              onChange={(event) => patch(item.id, { title: event.target.value })}
            />
          </label>
          <label className="field">
            Afbeelding
            <input
              value={item.image || ''}
              onChange={(event) => patch(item.id, { image: event.target.value })}
            />
          </label>
          {block.type === 'gallery' && (
            <ImagePanel
              settings={item.imageSettings}
              fallbackAlt={item.title}
              onChange={(imageSettings) => patch(item.id, { imageSettings })}
            />
          )}
          {block.type === 'grid' && (
            <>
              <label className="field">
                Detailpagina
                <select
                  value={item.pageId || ''}
                  onChange={(event) => patch(item.id, { pageId: event.target.value })}
                >
                  <option value="">Compact projectvenster</option>
                  {pages.map((page) => (
                    <option key={page.id} value={page.id}>
                      {page.title}
                    </option>
                  ))}
                </select>
              </label>
              <button className="text-button" onClick={() => action('create-project-page', item)}>
                <Plus size={12} />
                Filmische detailpagina maken
              </button>
              <label className="field">
                Projectbeschrijving
                <textarea
                  rows="3"
                  value={item.description || ''}
                  onChange={(event) => patch(item.id, { description: event.target.value })}
                />
              </label>
              <label className="field">
                YouTube-link
                <input
                  value={item.url || ''}
                  onChange={(event) => patch(item.id, { url: event.target.value })}
                />
              </label>
              <label className="field">
                Categorie
                <input
                  list={`project-categories-${item.id}`}
                  value={item.category || ''}
                  onChange={(event) => patch(item.id, { category: event.target.value })}
                />
                <datalist id={`project-categories-${item.id}`}>
                  <option>School</option>
                  <option>Professioneel</option>
                </datalist>
              </label>
              <div className="field-row">
                <label className="field">
                  Jaar
                  <input
                    value={item.year || ''}
                    onChange={(event) => patch(item.id, { year: event.target.value })}
                  />
                </label>
                <label className="field">
                  Leerjaar
                  <input
                    value={item.schoolYear || ''}
                    onChange={(event) => patch(item.id, { schoolYear: event.target.value })}
                  />
                </label>
              </div>
              <label className="field">
                Opleiding
                <input
                  value={item.education || ''}
                  onChange={(event) => patch(item.id, { education: event.target.value })}
                />
              </label>
            </>
          )}
          <div className="mini-toolbar">
            <button
              className="text-button"
              disabled={index === 0}
              onClick={() => {
                const items = [...block.items]
                ;[items[index - 1], items[index]] = [items[index], items[index - 1]]
                update({ items })
              }}
            >
              <ArrowUp size={12} />
              Omhoog
            </button>
            <button
              className="icon-button danger"
              aria-label="Item verwijderen"
              onClick={() => update({ items: block.items.filter((entry) => entry.id !== item.id) })}
            >
              <Trash2 size={13} />
            </button>
          </div>
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
                title: 'Nieuw verhaal',
                image: '/images/coast.jpg',
                category: 'Professioneel',
                year: '2026',
                url: '',
                education: '',
                schoolYear: '',
              },
            ],
          })
        }
      >
        <Plus size={13} />
        Item toevoegen
      </button>
    </div>
  )
}
