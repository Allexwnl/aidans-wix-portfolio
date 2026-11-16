/** Veilige tekstopmaak — versie 1.0 | Laatst gewijzigd: 2026-10-29. Alleen toegestane inline elementen. */
import { safeUrl } from './validation.js'
const tags = new Set(['strong', 'b', 'em', 'i', 'u', 's', 'strike', 'a', 'br', 'span'])

// Zet browseropmaak om in data; scripts en willekeurige stijlen worden nooit bewaard.
export function readRichText(element) {
  return [...element.childNodes].flatMap((node) => {
    if (node.nodeType === 3) return [{ text: node.textContent }]
    if (node.nodeType !== 1 || ['SCRIPT', 'STYLE', 'IFRAME'].includes(node.tagName)) return []
    const tag = node.tagName.toLowerCase()
    const children = readRichText(node)
    if (!tags.has(tag)) return [...children, ...(['div', 'p'].includes(tag) ? [{ tag: 'br' }] : [])]
    return [
      {
        tag,
        ...(tag === 'a' ? { href: safeUrl(node.getAttribute('href') || '') } : {}),
        ...(tag === 'br' ? {} : { children }),
      },
    ]
  })
}

// Bouwt DOM met tekstnodes; geïmporteerde inhoud kan geen HTML uitvoeren.
export function writeRichText(document, nodes) {
  const fragment = document.createDocumentFragment()
  for (const node of nodes || []) {
    if (typeof node.text === 'string') fragment.append(document.createTextNode(node.text))
    else if (tags.has(node.tag)) {
      const element = document.createElement(node.tag)
      if (node.tag === 'a') element.setAttribute('href', safeUrl(node.href) || '#')
      if (node.children) element.append(writeRichText(document, node.children))
      fragment.append(element)
    }
  }
  return fragment
}

// Limiteert importdiepte en controleert de structuur vóór opslag/publicatie.
export function validateRichText(nodes, depth = 0) {
  if (!Array.isArray(nodes) || depth > 20 || nodes.length > 10000)
    throw new Error('De tekstopmaak is ongeldig of te groot.')
  for (const node of nodes) {
    if (!node || (typeof node.text !== 'string' && !tags.has(node.tag)))
      throw new Error('Onbekende tekstopmaak.')
    if (node.href && !safeUrl(node.href)) throw new Error('Ongeldige link in tekst.')
    if (node.children) validateRichText(node.children, depth + 1)
  }
}
