/** Tekstgereedschap — versie 1.0 | Laatst gewijzigd: 2026-10-29. Behoudt de selectie in het canvas. */
import { useState } from 'react'
import { safeUrl } from '../../lib/validation.js'

// Native bewerkingscommando's behouden de browserselectie bij directe tekstinvoer.
export function InlineToolbar({ target, commit }) {
  const [link, setLink] = useState('')
  const [range, setRange] = useState(null)
  const execute = (command, value) => {
    const element = target.current
    const document = element.ownerDocument
    element.focus()
    if (command === 'createLink' && range) {
      const selection = document.getSelection()
      selection.removeAllRanges()
      selection.addRange(range)
    }
    document.execCommand(command, false, value)
    commit()
  }
  return (
    <div
      className="inline-toolbar"
      role="toolbar"
      aria-label="Tekstopmaak"
      contentEditable={false}
      onClick={(event) => event.stopPropagation()}
    >
      {[
        ['bold', 'Vet', 'B'],
        ['italic', 'Cursief', 'I'],
        ['underline', 'Onderstrepen', 'U'],
        ['strikeThrough', 'Doorhalen', 'S'],
        ['removeFormat', 'Opmaak wissen', 'Tx'],
        ['unlink', 'Link verwijderen', '↛'],
      ].map(([command, label, text]) => (
        <button
          key={command}
          aria-label={label}
          title={label}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => execute(command)}
        >
          {text}
        </button>
      ))}
      <input
        aria-label="Tekstlink"
        placeholder="https://…"
        value={link}
        onFocus={() => {
          const selection = target.current.ownerDocument.getSelection()
          if (selection.rangeCount && target.current.contains(selection.anchorNode))
            setRange(selection.getRangeAt(0).cloneRange())
        }}
        onChange={(event) => setLink(event.target.value)}
      />
      <button
        disabled={!safeUrl(link) || !range || range.collapsed}
        onMouseDown={(event) => event.preventDefault()}
        onClick={() => execute('createLink', safeUrl(link))}
      >
        Link
      </button>
    </div>
  )
}
