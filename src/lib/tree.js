/** Bouwsteenboom — versie 1.0 | Laatst gewijzigd: 2026-10-29. Onveranderlijke geneste indelingen. */
// Zoekt een bouwsteen samen met zijn ouder en positie.
export function locateBlock(nodes, id, parentId = '') {
  for (const [index, node] of nodes.entries()) {
    if (node.id === id) return { node, parentId, index }
    const found = node.children && locateBlock(node.children, id, node.id)
    if (found) return found
  }
  return null
}

// Bezoekt ook alle kinderen; de callback mag een bouwsteen vervangen of verwijderen.
export function mapBlocks(nodes, transform) {
  return nodes.flatMap((node) => {
    const next = transform(node)
    if (!next) return []
    return [
      { ...next, ...(next.children ? { children: mapBlocks(next.children, transform) } : {}) },
    ]
  })
}

// Voegt een element in een container of op paginaniveau toe.
export function insertBlock(nodes, node, parentId = '', index = Infinity) {
  if (!parentId) {
    const next = [...nodes]
    next.splice(Math.max(0, Math.min(index, next.length)), 0, node)
    return next
  }
  return mapBlocks(nodes, (item) =>
    item.id === parentId && item.type === 'container'
      ? { ...item, children: insertBlock(item.children || [], node, '', index) }
      : item
  )
}

// Een kopie krijgt op ieder niveau eigen identificaties, inclusief galerie-items.
export function cloneBlock(node) {
  const copy = { ...structuredClone(node), id: crypto.randomUUID() }
  if (copy.children) copy.children = copy.children.map(cloneBlock)
  if (copy.items) copy.items = copy.items.map((item) => ({ ...item, id: crypto.randomUUID() }))
  return copy
}
