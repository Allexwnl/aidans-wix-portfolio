/** Eigenschappen — versie 2.0 | Laatst gewijzigd: 2026-11-04. Inhoud, layout en beweging van de selectie. */
import {
  Copy,
  Film,
  SlidersHorizontal,
  Trash2,
  WandSparkles,
  ArrowLeftRight,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react'
import { useState } from 'react'
import { VisibilityPanel } from './VisibilityPanel.jsx'
import { VideoStylePanel } from './VideoStylePanel.jsx'
import { MotionPanel } from './MotionPanel.jsx'
import { LayoutPanel } from './LayoutPanel.jsx'
import { TypographyPanel } from './TypographyPanel.jsx'
import { ItemEditor } from './ItemEditor.jsx'
import { ColumnEditor } from './ColumnEditor.jsx'
import { youtubeId } from '../../lib/validation.js'

// Toont alleen instellingen die voor de geselecteerde bouwsteen relevant zijn.
export function PropertiesPanel({ block, update, action, device, replay, pages, site }) {
  const [tab, setTab] = useState('design')
  if (!block)
    return (
      <aside className="properties-panel">
        <div className="empty-properties">
          <SlidersHorizontal size={24} />
          <h3>Maak het van jou.</h3>
          <p>Selecteer een bouwsteen op je pagina om hem aan te passen.</p>
        </div>
      </aside>
    )
  const mobile = device === 'mobile'
  return (
    <aside className="properties-panel">
      <div className="properties-heading">
        <div>
          <span className="eyebrow">GESELECTEERD ELEMENT</span>
          <h2>{block.label}</h2>
        </div>
        <span className="element-icon">
          {block.type === 'video' ? <Film size={17} /> : <SlidersHorizontal size={17} />}
        </span>
      </div>
      <div className="property-tabs">
        <button className={tab === 'design' ? 'active' : ''} onClick={() => setTab('design')}>
          Vormgeving
        </button>
        <button className={tab === 'motion' ? 'active' : ''} onClick={() => setTab('motion')}>
          <WandSparkles size={12} />
          Animatie
        </button>
      </div>
      <div className="properties-scroll">
        {tab === 'design' ? (
          <>
            <VisibilityPanel block={block} update={update} />
            <div className="settings-group">
              <h3>Inhoud</h3>
              <label className="field">
                Naam in lagen
                <input
                  value={block.label}
                  onChange={(event) => update({ label: event.target.value })}
                />
              </label>
              <label className="field">
                Titel
                <textarea
                  rows="2"
                  value={block.title || ''}
                  onChange={(event) => update({ title: event.target.value })}
                />
              </label>
              <label className="field">
                Tekst
                <textarea
                  rows="2"
                  value={block.text || ''}
                  onChange={(event) => update({ text: event.target.value })}
                />
              </label>
              {block.type === 'hero' && (
                <label className="field">
                  Introductietekst
                  <textarea
                    rows="3"
                    value={block.caption || ''}
                    onChange={(event) => update({ caption: event.target.value })}
                  />
                </label>
              )}
              {['video', 'image'].includes(block.type) && (
                <label className="field">
                  {block.type === 'video' ? 'Posterafbeelding' : 'Afbeelding-URL'}
                  <input
                    value={block.image || ''}
                    placeholder="https://…"
                    onChange={(event) => update({ image: event.target.value })}
                  />
                  <button className="text-button" onClick={() => action('open-media')}>
                    Kiezen uit mediabibliotheek ↗
                  </button>
                </label>
              )}
              {block.type === 'video' && (
                <>
                  <label className="field">
                    YouTube-link
                    <input
                      placeholder="https://youtube.com/watch?v=…"
                      value={block.url || ''}
                      onChange={(event) => update({ url: event.target.value })}
                    />
                    {block.url && !youtubeId(block.url) && (
                      <small className="danger">Gebruik een geldige YouTube-link.</small>
                    )}
                  </label>
                  <div className="field-row">
                    <label className="field">
                      Klant
                      <input
                        value={block.client || ''}
                        onChange={(event) => update({ client: event.target.value })}
                      />
                    </label>
                    <label className="field">
                      Jaar
                      <input
                        value={block.year || ''}
                        onChange={(event) => update({ year: event.target.value })}
                      />
                    </label>
                  </div>
                  <label className="field">
                    Categorie
                    <input
                      value={block.category || ''}
                      onChange={(event) => update({ category: event.target.value })}
                    />
                  </label>
                  <div className="field-row">
                    <label className="field">
                      Beeldverhouding
                      <select
                        value={block.ratio || '16 / 9'}
                        onChange={(event) => update({ ratio: event.target.value })}
                      >
                        <option>16 / 9</option>
                        <option>21 / 9</option>
                        <option>4 / 3</option>
                        <option>1 / 1</option>
                        <option>9 / 16</option>
                      </select>
                    </label>
                    <label className="field">
                      Start (sec)
                      <input
                        type="number"
                        min="0"
                        value={block.start || 0}
                        onChange={(event) =>
                          update({ start: Math.max(0, Number(event.target.value)) })
                        }
                      />
                    </label>
                  </div>
                  <label className="toggle-row">
                    Video herhalen
                    <input
                      type="checkbox"
                      checked={!!block.loop}
                      onChange={(event) => update({ loop: event.target.checked })}
                    />
                  </label>
                  <p className="helper-text">
                    De kijker kiest afspeelkwaliteit in de YouTube-speler.
                  </p>
                </>
              )}
              {block.type === 'contact' && (
                <>
                  <label className="field">
                    Link / e-mailadres
                    <input
                      value={block.url || ''}
                      onChange={(event) => update({ url: event.target.value })}
                    />
                  </label>
                  <label className="field">
                    Knoptekst
                    <input
                      value={block.button || ''}
                      onChange={(event) => update({ button: event.target.value })}
                    />
                  </label>
                </>
              )}
            </div>
            <div className="settings-group">
              <h3>
                Indeling <span>{mobile ? 'MOBIEL' : 'DESKTOP'}</span>
              </h3>
              <label className="field">
                Breedte <span>{block.width || 100}%</span>
                <input
                  type="range"
                  min="20"
                  max="100"
                  value={block.width || 100}
                  onChange={(event) => update({ width: Number(event.target.value) })}
                />
              </label>
              <div className="full-width-note">
                <ArrowLeftRight size={12} />
                100% = volledige beschikbare breedte
              </div>
              <label className="toggle-row" style={{ marginTop: 18 }}>
                Beeld tot aan de rand
                <input
                  type="checkbox"
                  checked={!!block.fullBleed}
                  onChange={(event) => update({ fullBleed: event.target.checked })}
                />
              </label>
              <label className="field">
                Ruimte boven en onder{' '}
                <span>{mobile ? (block.mobile?.spacing ?? 35) : (block.spacing ?? 60)}px</span>
                <input
                  type="range"
                  min="0"
                  max="180"
                  value={mobile ? (block.mobile?.spacing ?? 35) : (block.spacing ?? 60)}
                  onChange={(event) =>
                    update(
                      mobile
                        ? { mobile: { ...block.mobile, spacing: Number(event.target.value) } }
                        : { spacing: Number(event.target.value) }
                    )
                  }
                />
              </label>
              {block.type === 'hero' && (
                <label className="field">
                  Titelgrootte{' '}
                  <span>{mobile ? block.mobile?.fontSize || 48 : block.fontSize || 90}px</span>
                  <input
                    type="range"
                    min="24"
                    max="180"
                    value={mobile ? block.mobile?.fontSize || 48 : block.fontSize || 90}
                    onChange={(event) =>
                      update(
                        mobile
                          ? { mobile: { ...block.mobile, fontSize: Number(event.target.value) } }
                          : { fontSize: Number(event.target.value) }
                      )
                    }
                  />
                </label>
              )}
              <label className="field">Uitlijning</label>
              <div className="segmented">
                {[
                  ['left', AlignLeft],
                  ['center', AlignCenter],
                  ['right', AlignRight],
                ].map(([value, Icon]) => (
                  <button
                    aria-label={`Uitlijning ${value}`}
                    key={value}
                    className={block.align === value ? 'active' : ''}
                    onClick={() => update({ align: value })}
                  >
                    <Icon size={14} />
                  </button>
                ))}
              </div>
            </div>
            {block.type === 'video' && <VideoStylePanel {...{ block, update }} />}
            <LayoutPanel {...{ block, update, device, pages, action }} />
            <TypographyPanel {...{ block, update, device }} fonts={site.fonts || []} />
            <div className="settings-group">
              <h3>Eigen kleuren</h3>
              <div className="field-row">
                <label className="field">
                  Achtergrond
                  <input
                    type="color"
                    value={block.background || '#eeede8'}
                    onChange={(event) => update({ background: event.target.value })}
                  />
                </label>
                <label className="field">
                  Tekst
                  <input
                    type="color"
                    value={block.color || '#23251f'}
                    onChange={(event) => update({ color: event.target.value })}
                  />
                </label>
              </div>
              <button className="text-button" onClick={() => update({ background: '', color: '' })}>
                Themakleuren gebruiken
              </button>
            </div>
            {['grid', 'gallery'].includes(block.type) && (
              <ItemEditor block={block} update={update} action={action} pages={pages} />
            )}
            {block.type === 'columns' && (
              <ColumnEditor block={block} update={update} device={device} />
            )}
          </>
        ) : (
          <MotionPanel {...{ block, update, replay }} />
        )}
      </div>
      <div className="properties-footer">
        <button onClick={() => action('duplicate-block')}>
          <Copy size={14} />
          Dupliceren
        </button>
        <button
          className="danger"
          onClick={() => action('delete-block')}
          aria-label="Bouwsteen verwijderen"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </aside>
  )
}
