/** Intro — versie 1.0 | Laatst gewijzigd: 2026-10-29. Korte tekstzoom met overslaan en sessiegeheugen. */
import { useEffect, useState } from 'react'

// De optionele introductie speelt één keer per sessie en blokkeert nooit langdurig de site.
export function IntroOverlay({ text }) {
  const [visible, setVisible] = useState(
    () =>
      !sessionStorage.getItem('aidan:intro-seen') &&
      !matchMedia('(prefers-reduced-motion: reduce)').matches
  )
  useEffect(() => {
    sessionStorage.setItem('aidan:intro-seen', '1')
    const timer = setTimeout(() => setVisible(false), 1700)
    return () => clearTimeout(timer)
  }, [])
  if (!visible) return null
  return (
    <div className="intro-overlay">
      <p>{text || 'Elk verhaal begint met kijken.'}</p>
      <button onClick={() => setVisible(false)}>Intro overslaan ↗</button>
    </div>
  )
}
