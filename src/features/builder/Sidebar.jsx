/** Zijbalk — versie 2.0 | Laatst gewijzigd: 2026-11-04. Pagina's, lagen en bouwstenen. */
import {
  ChevronDown,
  File,
  Layers,
  LayoutGrid,
  LayoutTemplate,
  Menu,
  MoreHorizontal,
  Palette,
  Plus,
  Settings2,
  Film,
  Image,
  Type,
  AlignLeft,
  GalleryHorizontalEnd,
  ArrowUpRight,
  LogOut,
} from 'lucide-react'
import { LayerTree } from './LayerTree.jsx'
import { blockTypes } from '../../data/initialSite.js'
import { ThemePanel } from '../panels/ThemePanel.jsx'
import { NavigationPanel } from '../panels/NavigationPanel.jsx'
import { MediaPanel } from '../media/MediaPanel.jsx'
import { SettingsPanel } from '../panels/SettingsPanel.jsx'

const icons = { Type, AlignLeft, Film, Image, GalleryHorizontalEnd, LayoutGrid, ArrowUpRight }
const tabs = [
  { id: 'pages', icon: File, label: 'Pagina’s' },
  { id: 'blocks', icon: Plus, label: 'Toevoegen' },
  { id: 'theme', icon: Palette, label: 'Vormgeving' },
  { id: 'navigation', icon: Menu, label: 'Navigatie' },
  { id: 'media', icon: Image, label: 'Media' },
]

// Wisselt tussen gerichte panelen zonder het canvas te verlaten.
export function Sidebar({
  tab,
  setTab,
  site,
  page,
  selected,
  setSelected,
  setPageId,
  action,
  model,
  onLogout,
}) {
  return (
    <aside className="studio-sidebar">
      <div className="sidebar-site">
        <span className="site-avatar">a.</span>
        <div>
          <strong>Mijn website</strong>
          <span>Jouw creatieve speelruimte</span>
        </div>
        <ChevronDown size={14} />
      </div>
      <div className="sidebar-tabs">
        {tabs.map(({ id, icon: Icon, label }) => (
          <button key={id} className={tab === id ? 'active' : ''} onClick={() => setTab(id)}>
            <Icon size={17} />
            <span>{label}</span>
            {id === 'pages' && <span className="count">{site.pages.length}</span>}
          </button>
        ))}
      </div>
      <div className="sidebar-content">
        {tab === 'pages' && (
          <>
            <div className="panel-label">
              <span>PAGINA'S</span>
              <button
                className="icon-button"
                aria-label="Pagina toevoegen"
                onClick={() => action('add-page')}
              >
                <Plus size={14} />
              </button>
            </div>
            <div className="pages-list">
              {site.pages.map((item) => (
                <button
                  className={item.id === page.id ? 'active' : ''}
                  key={item.id}
                  onClick={() => {
                    setPageId(item.id)
                    setSelected(item.sections[0]?.id)
                  }}
                >
                  <File size={14} />
                  <span>{item.title}</span>
                  {item.slug === '' ? (
                    <span className="home-tag">HOME</span>
                  ) : (
                    <span className="page-arrow">↗</span>
                  )}
                </button>
              ))}
            </div>
            <div className="layers-title">
              <span>
                <Layers size={13} />
                PAGINA-INHOUD
              </span>
              <button
                className="icon-button"
                aria-label="Bouwsteen toevoegen"
                onClick={() => setTab('blocks')}
              >
                <Plus size={14} />
              </button>
            </div>
            <LayerTree nodes={page.sections} {...{ selected, setSelected, action }} />
            <button className="add-section" onClick={() => setTab('blocks')}>
              <Plus size={14} />
              Bouwsteen toevoegen
            </button>
            <details className="page-settings">
              <summary>
                Pagina-instellingen <Settings2 size={13} />
              </summary>
              <label className="field">
                Naam
                <input
                  value={page.title}
                  onChange={(event) => action('page-patch', { title: event.target.value })}
                />
              </label>
              <label className="field">
                URL-pad
                <input
                  value={page.slug}
                  placeholder="Leeg = homepage"
                  onChange={(event) => action('page-patch', { slug: event.target.value })}
                />
              </label>
              <button className="text-button" onClick={() => action('duplicate-page')}>
                Pagina dupliceren
              </button>
              <button
                className="text-button danger"
                disabled={site.pages.length < 2 || page.slug === ''}
                onClick={() => action('delete-page')}
              >
                Pagina verwijderen
              </button>
            </details>
          </>
        )}
        {tab === 'blocks' && (
          <>
            <div className="panel-heading">
              <span className="eyebrow">MAAK HET VAN JOU</span>
              <h2>Bouwstenen</h2>
              <p>Een goed verhaal begint met een eerste element.</p>
            </div>
            <div className="block-library">
              {blockTypes.map((block) => {
                const Icon = icons[block.icon]
                return (
                  <button key={block.type} onClick={() => action('add-block', block.type)}>
                    <span>
                      <Icon size={21} />
                    </span>
                    <div>
                      <strong>{block.name}</strong>
                      <small>{block.description}</small>
                    </div>
                    <Plus size={13} />
                  </button>
                )
              })}
            </div>
          </>
        )}
        {tab === 'theme' && <ThemePanel site={site} change={model.change} />}
        {tab === 'navigation' && <NavigationPanel site={site} change={model.change} />}
        {tab === 'media' && <MediaPanel action={action} />}
        {tab === 'settings' && <SettingsPanel model={model} action={action} onLogout={onLogout} />}
      </div>
      <div className="sidebar-bottom">
        <button onClick={() => setTab('settings')} className={tab === 'settings' ? 'active' : ''}>
          <Settings2 size={16} />
          Instellingen
          <MoreHorizontal size={15} />
        </button>
        <div className="sidebar-tip">
          <LayoutTemplate size={17} />
          <p>
            Jouw werk. Jouw verhaal.
            <br />
            <span>Maak er iets eigens van.</span>
          </p>
        </div>
        {onLogout && (
          <button className="logout-small" onClick={onLogout}>
            <LogOut size={12} />
            Uitloggen
          </button>
        )}
      </div>
    </aside>
  )
}
