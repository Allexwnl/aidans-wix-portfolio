/** Bewegingsinstellingen — versie 1.1 | Laatst gewijzigd: 2026-11-16. Presets, trigger en mobiele override. */
import { motionPresets, motionTriggers } from '../../data/motion.js'
import { resolveMotion } from '../../lib/motion.js'

// Op desktop bewerk je de basis; in het mobiele voorbeeld alleen de afwijkende mobiele waarden.
export function MotionPanel({ block, update, replay, device }) {
  const mobile = device === 'mobile'
  // Waarden die nu gelden voor het gekozen apparaat.
  const values = resolveMotion(block, mobile)
  const override = block.mobile?.motion || {}
  // Schrijft naar de mobiele override of naar de basisvelden van de bouwsteen.
  const set = (patch) =>
    mobile
      ? update({ mobile: { ...block.mobile, motion: { ...override, ...patch } } })
      : update(
          Object.fromEntries(
            Object.entries(patch).map(([key, value]) => [
              key === 'distance' ? 'motionDistance' : key,
              value,
            ])
          )
        )
  return (
    <div className="motion-settings">
      <h3>Beweging met karakter.</h3>
      <p>
        {mobile
          ? 'Je bewerkt nu de animatie voor mobiel. Desktop blijft ongewijzigd.'
          : 'Kies een effect en bekijk het in de voorbeeldmodus.'}
      </p>
      <label className="field">
        Animatie {mobile && <span>MOBIEL</span>}
        <select
          value={mobile ? override.animation || '' : values.animation}
          onChange={(event) => set({ animation: event.target.value })}
        >
          {/* Leeg betekent: mobiel volgt het desktopeffect. */}
          {mobile && <option value="">Zelfde als desktop</option>}
          {motionPresets.map(([id, label]) => (
            <option key={id} value={id}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <label className="field">
        Duur (ms)
        <input
          type="range"
          min="200"
          max="2400"
          step="100"
          value={values.duration}
          onChange={(event) => set({ duration: Number(event.target.value) })}
        />
        <span>{values.duration} ms</span>
      </label>
      <label className="field">
        Vertraging (ms)
        <input
          type="number"
          min="0"
          max="2000"
          step="50"
          value={values.delay}
          onChange={(event) =>
            set({ delay: Math.min(2000, Math.max(0, Number(event.target.value))) })
          }
        />
      </label>
      <label className="field">
        Sterkte (afstand in px)
        <input
          type="range"
          min="10"
          max="200"
          value={values.distance}
          onChange={(event) => set({ distance: Number(event.target.value) })}
        />
        <span>{values.distance} px</span>
      </label>
      {mobile ? (
        <button
          className="text-button"
          disabled={!block.mobile?.motion}
          onClick={() => update({ mobile: { ...block.mobile, motion: undefined } })}
        >
          Mobiel gelijk aan desktop
        </button>
      ) : (
        <>
          <label className="field">
            Start
            <select
              value={values.trigger}
              onChange={(event) => update({ motionTrigger: event.target.value })}
            >
              {motionTriggers.map(([id, label]) => (
                <option key={id} value={id}>
                  {label}
                </option>
              ))}
            </select>
          </label>
          <label className="field">
            Bewegingscurve
            <select
              value={values.easing}
              onChange={(event) => update({ easing: event.target.value })}
            >
              <option value="cinematic">Filmisch afremmen</option>
              <option value="gentle">Zacht versnellen en afremmen</option>
              <option value="linear">Gelijkmatig</option>
            </select>
          </label>
          <label className="toggle-row">
            Herhalen bij opnieuw in beeld
            <input
              type="checkbox"
              checked={values.repeat}
              onChange={(event) => update({ motionRepeat: event.target.checked })}
            />
          </label>
        </>
      )}
      <button className="button secondary wide" onClick={replay}>
        Animatie bekijken
      </button>
      <p className="helper-text">
        Start, curve en herhalen gelden voor beide apparaten; effect, duur, vertraging en sterkte
        kun je in het mobiele voorbeeld apart instellen. In bewerken blijven elementen zichtbaar.
        Bij minder beweging zijn onthullingen direct zichtbaar.
      </p>
    </div>
  )
}
