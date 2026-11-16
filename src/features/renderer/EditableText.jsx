/** Inline tekst — versie 2.0 | Laatst gewijzigd: 2026-11-04. Veilige opmaak per apparaat. */
import { useLayoutEffect, useRef, useState } from 'react'
import { readRichText, writeRichText } from '../../lib/richText.js'
import { InlineToolbar } from './InlineToolbar.jsx'

// Opmaak staat naast platte tekst; externe tekstwijzigingen vervangen oude opmaak.
export function EditableText({ block, field, tag = 'p', editing, onEdit, className = '' }) {
  const ref = useRef(null)
  const [focused, setFocused] = useState(false)
  const visible = block.visibility?.[field] !== false
  const value = block[field] || ''
  const rich = block.richText?.[field]
  const typography = block.typography?.[field] || {}
  const mobile = block.mobile?.typography?.[field] || {}
  const Tag = tag
  useLayoutEffect(() => {
    const element = ref.current
    if (!element) return
    if (
      element.innerText === value &&
      JSON.stringify(readRichText(element)) === JSON.stringify(rich?.nodes)
    )
      return
    if (rich?.plain === value)
      element.replaceChildren(writeRichText(element.ownerDocument, rich.nodes))
    else if (element.innerText !== value) element.innerText = value
  }, [value, rich, visible])
  const commit = () => {
    const plain = ref.current.innerText
    onEdit(block.id, {
      [field]: plain,
      richText: { ...block.richText, [field]: { plain, nodes: readRichText(ref.current) } },
    })
  }
  const style = {}
  // De werkelijke iframebreedte bepaalt welke typografie geldt.
  for (const [key, css, unit] of [
    ['fontSize', 'size', 'px'],
    ['lineHeight', 'line', ''],
    ['letterSpacing', 'tracking', 'px'],
    ['fontFamily', 'family', ''],
    ['fontWeight', 'weight', ''],
    ['fontStyle', 'style', ''],
    ['textDecoration', 'decoration', ''],
    ['textTransform', 'case', ''],
    ['textAlign', 'align', ''],
    ['color', 'color', ''],
  ]) {
    if (typography[key] !== undefined && typography[key] !== '')
      style[`--text-${css}`] = `${typography[key]}${unit}`
    if (mobile[key] !== undefined && mobile[key] !== '')
      style[`--text-mobile-${css}`] = `${mobile[key]}${unit}`
  }
  if (!visible) return null
  return (
    <div
      className={`editable-text-wrap ${focused && editing ? 'text-focused' : ''}`}
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setFocused(false)
      }}
    >
      {editing && focused && <InlineToolbar target={ref} commit={commit} />}
      <Tag
        ref={ref}
        className={`rich-text ${className}`}
        style={style}
        contentEditable={editing ? true : undefined}
        suppressContentEditableWarning
        aria-label={
          editing ? `${block.label}: ${field === 'title' ? 'titel' : 'tekst'}` : undefined
        }
        onInput={editing ? commit : undefined}
        onClick={
          editing
            ? (event) => {
                if (event.target.closest('a')) event.preventDefault()
              }
            : undefined
        }
        onPaste={
          editing
            ? (event) => {
                event.preventDefault()
                event.currentTarget.ownerDocument.execCommand(
                  'insertText',
                  false,
                  event.clipboardData.getData('text/plain')
                )
              }
            : undefined
        }
      />
    </div>
  )
}
