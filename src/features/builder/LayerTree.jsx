/** Geneste lagen — versie 1.0 | Laatst gewijzigd: 2026-10-29. Slepen én toetsenbordbediening. */
import { ArrowUp, ArrowDown, GripVertical } from 'lucide-react'

// Elke container heeft een eigen invoegzone en dezelfde bediening als de pagina.
export function LayerTree({ nodes, parentId = '', selected, setSelected, action }) {
  return (
    <div className="layer-tree">
      {nodes.map((node, index) => (
        <div key={node.id}>
          <div
            className={`layer-row ${selected === node.id ? 'selected' : ''}`}
            draggable
            onDragStart={(event) => {
              event.stopPropagation()
              event.dataTransfer.setData('text/aidan-block', node.id)
            }}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault()
              event.stopPropagation()
              action('move-node', {
                id: event.dataTransfer.getData('text/aidan-block'),
                parentId,
                index,
              })
            }}
          >
            <button className="layer-select" onClick={() => setSelected(node.id)}>
              <GripVertical size={12} />
              <span>
                {node.type === 'container' ? '▦ ' : ''}
                {node.label}
              </span>
            </button>
            {selected === node.id && (
              <div className="layer-arrows">
                <button
                  aria-label="Sectie omhoog"
                  disabled={index === 0}
                  onClick={() => action('move-node', { id: node.id, parentId, index: index - 1 })}
                >
                  <ArrowUp size={12} />
                </button>
                <button
                  aria-label="Sectie omlaag"
                  disabled={index === nodes.length - 1}
                  onClick={() => action('move-node', { id: node.id, parentId, index: index + 1 })}
                >
                  <ArrowDown size={12} />
                </button>
              </div>
            )}
          </div>
          {node.type === 'container' && (
            <div className="layer-children">
              <LayerTree
                nodes={node.children || []}
                parentId={node.id}
                {...{ selected, setSelected, action }}
              />
            </div>
          )}
        </div>
      ))}
      <button
        className="layer-drop"
        onClick={() => setSelected(parentId || null)}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault()
          event.stopPropagation()
          action('move-node', { id: event.dataTransfer.getData('text/aidan-block'), parentId })
        }}
      >
        {parentId ? '+ In deze container plaatsen' : '+ Op paginaniveau plaatsen'}
      </button>
    </div>
  )
}
