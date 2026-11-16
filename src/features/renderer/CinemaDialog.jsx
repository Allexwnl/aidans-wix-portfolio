/** Bioscoopvenster — versie 2.0 | Laatst gewijzigd: 2026-11-04. Focus, Escape en stop bij sluiten. */
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

// Native dialog houdt toetsenbordfocus binnen het venster, ook in het mobiele canvas.
export function CinemaDialog({ document, title, children, onClose }) {
  const dialog = useRef(null)
  const callback = useRef(onClose)
  const [closing, setClosing] = useState(false)
  useEffect(() => {
    callback.current = onClose
  }, [onClose])
  useEffect(() => {
    const element = dialog.current
    const owner = element.ownerDocument
    const previousOverflow = owner.documentElement.style.overflow
    owner.documentElement.style.overflow = 'hidden'
    element.showModal()
    return () => {
      element.close()
      owner.documentElement.style.overflow = previousOverflow
    }
  }, [document])
  useEffect(() => {
    if (!closing) return
    const reduced = document.defaultView.matchMedia('(prefers-reduced-motion: reduce)').matches
    const timer = setTimeout(
      () => {
        dialog.current?.close()
        callback.current()
      },
      reduced ? 0 : 240
    )
    return () => clearTimeout(timer)
  }, [closing, document])
  return createPortal(
    <dialog
      ref={dialog}
      className={`cinema-dialog ${closing ? 'cinema-closing' : ''}`}
      aria-label={title || 'Film bekijken'}
      onCancel={(event) => {
        event.preventDefault()
        setClosing(true)
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) setClosing(true)
      }}
    >
      <div className="cinema-header">
        <span>{title}</span>
        <button autoFocus onClick={() => setClosing(true)}>
          Film sluiten ×
        </button>
      </div>
      <div className="cinema-screen">{!closing && children}</div>
    </dialog>,
    document.body
  )
}
