/** Menu-editor — versie 2.1 | Laatst gewijzigd: 2026-11-16. Links naar pagina, sectie of URL; één laag submenu's. */
import { NavbarPanel } from './NavbarPanel.jsx'
import { FooterPanel } from './FooterPanel.jsx'
import { LinkTargetField } from './LinkTargetField.jsx'
import { Plus, Trash2, ArrowUp } from 'lucide-react'

// Slaat de menuboom als data op; een bestemming is een pagina, een sectie of een externe URL.
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
          <div className="field">
            Bestemming
            <LinkTargetField
              name="Menulink"
              item={item}
              site={site}
              onChange={(value) => patch(item.id, value)}
            />
          </div>
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
              <LinkTargetField
                name="Submenu"
                item={child}
                site={site}
                onChange={(value) =>
                  patch(item.id, {
                    children: item.children.map((entry) =>
                      entry.id === child.id ? { ...entry, ...value } : entry
                    ),
                  })
                }
              />
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
      <FooterPanel site={site} change={change} />
    </>
  )
}
