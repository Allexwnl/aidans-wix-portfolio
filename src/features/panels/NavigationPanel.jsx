/** Menu-editor — versie 2.0 | Laatst gewijzigd: 2026-11-04. Bewerkbare links en één laag submenu's. */
import { NavbarPanel } from './NavbarPanel.jsx'
import { Plus, Trash2, ArrowUp } from 'lucide-react'

// Slaat de menuboom als data op; elke bestemming verwijst naar een bestaande pagina.
export function NavigationPanel({ site, change }) {
  // Vervangt één menu-item en laat de rest van de structuur intact.
  const patch = (id, value) =>
    change({
      ...site,
      navigation: site.navigation.map((item) => (item.id === id ? { ...item, ...value } : item)),
    })
  return (
    <>
      <div className="panel-heading">
        <span className="eyebrow">WIJS DE WEG</span>
        <h2>Navigatie</h2>
        <p>Pagina's verbinden. Ook op mobiel.</p>
      </div>
      <NavbarPanel site={site} change={change} />
      {site.navigation.map((item, index) => (
        <div className="menu-item-editor" key={item.id}>
          <div className="mini-toolbar">
            <span>MENU {index + 1}</span>
            <button
              className="icon-button"
              title="Omhoog"
              disabled={index === 0}
              onClick={() => {
                const next = [...site.navigation]
                ;[next[index - 1], next[index]] = [next[index], next[index - 1]]
                change({ ...site, navigation: next })
              }}
            >
              <ArrowUp size={13} />
            </button>
            <button
              className="icon-button danger"
              aria-label={`Verwijder ${item.label}`}
              onClick={() =>
                change({
                  ...site,
                  navigation: site.navigation.filter((entry) => entry.id !== item.id),
                })
              }
            >
              <Trash2 size={13} />
            </button>
          </div>
          <label className="field">
            Label
            <input
              value={item.label}
              onChange={(event) => patch(item.id, { label: event.target.value })}
            />
          </label>
          <label className="field">
            Pagina
            <select
              value={item.pageId}
              onChange={(event) => patch(item.id, { pageId: event.target.value })}
            >
              {site.pages.map((page) => (
                <option key={page.id} value={page.id}>
                  {page.title}
                </option>
              ))}
            </select>
          </label>
          {item.children.map((child) => (
            <div className="submenu-editor" key={child.id}>
              <input
                aria-label="Submenu label"
                value={child.label}
                onChange={(event) =>
                  patch(item.id, {
                    children: item.children.map((entry) =>
                      entry.id === child.id ? { ...entry, label: event.target.value } : entry
                    ),
                  })
                }
              />
              <select
                aria-label="Submenu pagina"
                value={child.pageId}
                onChange={(event) =>
                  patch(item.id, {
                    children: item.children.map((entry) =>
                      entry.id === child.id ? { ...entry, pageId: event.target.value } : entry
                    ),
                  })
                }
              >
                {site.pages.map((page) => (
                  <option key={page.id} value={page.id}>
                    {page.title}
                  </option>
                ))}
              </select>
              <button
                className="icon-button danger"
                aria-label="Submenu verwijderen"
                onClick={() =>
                  patch(item.id, {
                    children: item.children.filter((entry) => entry.id !== child.id),
                  })
                }
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <button
            className="text-button"
            onClick={() =>
              patch(item.id, {
                children: [
                  ...item.children,
                  { id: crypto.randomUUID(), label: 'Nieuwe link', pageId: site.pages[0].id },
                ],
              })
            }
          >
            <Plus size={12} />
            Submenu toevoegen
          </button>
        </div>
      ))}
      <button
        className="add-section"
        onClick={() =>
          change({
            ...site,
            navigation: [
              ...site.navigation,
              {
                id: crypto.randomUUID(),
                label: 'Nieuwe link',
                pageId: site.pages[0].id,
                children: [],
              },
            ],
          })
        }
      >
        <Plus size={14} />
        Menulink toevoegen
      </button>
    </>
  )
}
