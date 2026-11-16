/** Thema — versie 2.1 | Laatst gewijzigd: 2026-11-16. Globale kleuren en lettertypen. */
import { useRef } from 'react'
import { FontLoader } from '../renderer/FontLoader.jsx'
import { PageMotionPanel } from './PageMotionPanel.jsx'
import { FontPanel } from './FontPanel.jsx'
// Past de gedeelde themawaarden aan zodat alle pagina's hetzelfde fundament gebruiken.
export function ThemePanel({ site, change }) {
  const sample = useRef(null)
  return (
    <>
      <FontLoader fonts={site.fonts} root={sample} />
      <div className="panel-heading">
        <span className="eyebrow">DE JUISTE SFEER</span>
        <h2>Vormgeving</h2>
        <p>Een eigen stijl, tot in de details.</p>
      </div>
      <label className="field">
        Naam / woordmerk
        <input
          value={site.name}
          onChange={(event) => change({ ...site, name: event.target.value })}
        />
      </label>
      <div className="settings-group">
        <h3>Kleurenpalet</h3>
        {[
          ['background', 'Achtergrond'],
          ['foreground', 'Tekst'],
          ['accent', 'Accent'],
        ].map(([key, label]) => (
          <label className="color-field" key={key}>
            <input
              type="color"
              value={site.theme[key]}
              onChange={(event) =>
                change({ ...site, theme: { ...site.theme, [key]: event.target.value } })
              }
            />
            <span>
              {label}
              <small>{site.theme[key].toUpperCase()}</small>
            </span>
          </label>
        ))}
      </div>
      <div className="settings-group">
        <h3>Typografie</h3>
        <label className="field">
          Lettertype
          <select
            value={site.theme.font}
            onChange={(event) =>
              change({ ...site, theme: { ...site.theme, font: event.target.value } })
            }
          >
            {(site.fonts || []).map((font) => (
              <option key={font.id} value={font.family}>
                {font.name}
              </option>
            ))}
            <option value="Arial">Arial — helder & modern</option>
            <option value="Georgia">Georgia — redactioneel</option>
            <option value="Verdana">Verdana — ruim & open</option>
            <option value="Courier New">Courier — karaktervol</option>
          </select>
        </label>
        <p ref={sample} className="font-sample" style={{ fontFamily: site.theme.font }}>
          Aa
          <br />
          <span>Verhalen in beeld.</span>
        </p>
      </div>
      <FontPanel site={site} change={change} />
      <PageMotionPanel site={site} change={change} />
      <label className="field">
        Afgeronde hoeken <span>{site.theme.radius}px</span>
        <input
          type="range"
          min="0"
          max="40"
          value={site.theme.radius}
          onChange={(event) =>
            change({ ...site, theme: { ...site.theme, radius: Number(event.target.value) } })
          }
        />
      </label>
      <div className="settings-group">
        <h3>Identiteit & navigatie</h3>
        <label className="field">
          Tekst naast het logo
          <textarea
            rows="3"
            value={site.settings?.location || ''}
            onChange={(event) =>
              change({ ...site, settings: { ...site.settings, location: event.target.value } })
            }
          />
        </label>
        <label className="toggle-row">
          Navigatie blijft in beeld
          <input
            type="checkbox"
            checked={!!site.settings?.stickyNav}
            onChange={(event) =>
              change({ ...site, settings: { ...site.settings, stickyNav: event.target.checked } })
            }
          />
        </label>
      </div>
      <div className="settings-group">
        <h3>Korte tekstintro</h3>
        <label className="toggle-row">
          Introductie tonen
          <input
            type="checkbox"
            checked={!!site.settings?.intro}
            onChange={(event) =>
              change({ ...site, settings: { ...site.settings, intro: event.target.checked } })
            }
          />
        </label>
        <label className="field">
          Introductietekst
          <input
            value={site.settings?.introText || ''}
            onChange={(event) =>
              change({ ...site, settings: { ...site.settings, introText: event.target.value } })
            }
          />
        </label>
        <p className="helper-text">
          Een korte zoom, één keer per sessie. Bezoekers kunnen overslaan.
        </p>
      </div>
    </>
  )
}
