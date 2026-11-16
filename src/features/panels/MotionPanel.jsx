/** Bewegingsinstellingen — versie 1.0 | Laatst gewijzigd: 2026-10-29. Herbruikbare filmische presets. */
import { motionPresets } from '../../data/motion.js'

// Instellingen gelden op beide apparaten; reduced-motion wordt altijd gerespecteerd.
export function MotionPanel({ block, update, replay }) {
  return (
    <div className="motion-settings">
      <h3>Beweging met karakter.</h3>
      <p>Kies een effect en bekijk het in de voorbeeldmodus.</p>
      <label className="field">
        Animatie
        <select
          value={block.animation || 'none'}
          onChange={(event) => {
            update({ animation: event.target.value })
          }}
        >
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
          value={block.duration || 800}
          onChange={(event) => update({ duration: Number(event.target.value) })}
        />
        <span>{block.duration || 800} ms</span>
      </label>
      <label className="field">
        Vertraging (ms)
        <input
          type="number"
          min="0"
          max="2000"
          step="50"
          value={block.delay || 0}
          onChange={(event) =>
            update({ delay: Math.min(2000, Math.max(0, Number(event.target.value))) })
          }
        />
      </label>
      <label className="field">
        Afstand (px)
        <input
          type="range"
          min="10"
          max="200"
          value={block.motionDistance || 45}
          onChange={(event) => update({ motionDistance: Number(event.target.value) })}
        />
        <span>{block.motionDistance || 45} px</span>
      </label>
      <label className="field">
        Bewegingscurve
        <select
          value={block.easing || 'cinematic'}
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
          checked={!!block.motionRepeat}
          onChange={(event) => update({ motionRepeat: event.target.checked })}
        />
      </label>
      <button className="button secondary wide" onClick={replay}>
        Animatie bekijken
      </button>
      <p className="helper-text">
        Dezelfde effecten op mobiel. In bewerken blijven elementen zichtbaar. Bij minder beweging
        zijn onthullingen direct zichtbaar.
      </p>
    </div>
  )
}
