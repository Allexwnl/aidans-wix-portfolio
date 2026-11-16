/** Fontregistratie — versie 1.0 | Laatst gewijzigd: 2026-10-29. Werkt ook in het mobiele iframe. */
import { useEffect } from 'react'

// Registreert fonts op het juiste document; opgeruimde of vervangen fonts blijven niet hangen.
export function FontLoader({ fonts, root }) {
  useEffect(() => {
    const document = root.current?.ownerDocument
    if (!document || !fonts?.length) return
    let active = true
    const faces = fonts.map(
      (font) => new document.defaultView.FontFace(font.family, `url(${font.data})`)
    )
    faces.forEach((face) =>
      face
        .load()
        .then((loaded) => {
          if (active) document.fonts.add(loaded)
        })
        .catch(() => {
          /* Een onleesbaar font valt terug op het systeemlettertype. */
        })
    )
    return () => {
      active = false
      faces.forEach((face) => document.fonts.delete(face))
    }
  }, [fonts, root])
  return null
}
