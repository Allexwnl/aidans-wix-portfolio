/** Verplaatsen — versie 1.0 | Laatst gewijzigd: 2026-10-29. Voorkomt cyclische containers. */
import { locateBlock, mapBlocks, insertBlock } from './tree.js'

// Verplaatst naar een expliciete ouder; nooit naar zichzelf of een eigen afstammeling.
export function relocateBlock(nodes, id, parentId = '', index = Infinity) {
  const source = locateBlock(nodes, id)
  const target = parentId && locateBlock(nodes, parentId)
  if (!source || (parentId && target?.node.type !== 'container')) return nodes
  if (id === parentId || locateBlock(source.node.children || [], parentId)) return nodes
  return insertBlock(
    mapBlocks(nodes, (node) => (node.id === id ? null : node)),
    source.node,
    parentId,
    index
  )
}
