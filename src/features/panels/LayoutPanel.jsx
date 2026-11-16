/** Layoutvrijheid — versie 1.0 | Laatst gewijzigd: 2026-10-29. Responsive geneste containers. */
import { locateBlock, mapBlocks } from '../../lib/tree.js'

// Bewaart mobiele waarden apart; desktopwaarden blijven intact bij het omschakelen.
export function LayoutPanel({ block, update, device, pages, action }) {
  const mobile = device === 'mobile'
  const layout = { ...block.layout, ...(mobile ? block.mobile?.layout : {}) }
  const position = mobile ? block.mobile || {} : block
  const page = pages.find((item) => locateBlock(item.sections, block.id))
  const source = page && locateBlock(page.sections, block.id)
  const parents = []
  if (page)
    mapBlocks(page.sections, (node) => {
      if (
        node.type === 'container' &&
        node.id !== block.id &&
        !locateBlock(block.children || [], node.id)
      )
        parents.push(node)
      return node
    })
  const patchLayout = (patch) =>
    update(
      mobile
        ? { mobile: { ...block.mobile, layout: { ...block.mobile?.layout, ...patch } } }
        : { layout: { ...block.layout, ...patch } }
    )
  return (
    <div className="settings-group">
      <h3>
        Vrije indeling <span>{mobile ? 'MOBIEL' : 'DESKTOP'}</span>
      </h3>
      <label className="field">
        Plaatsen in
        <select
          value={source?.parentId || ''}
          onChange={(event) => action('move-node', { id: block.id, parentId: event.target.value })}
        >
          <option value="">Pagina</option>
          {parents.map((item) => (
            <option key={item.id} value={item.id}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      {block.type === 'container' && (
        <>
          <label className="field">
            Indelingstype
            <select
              value={layout.mode || 'grid'}
              onChange={(event) => patchLayout({ mode: event.target.value })}
            >
              <option value="grid">Raster</option>
              <option value="row">Rij (loopt door)</option>
              <option value="stack">Onder elkaar</option>
            </select>
          </label>
          {['columns', 'gap', 'padding', 'minHeight'].map((key, index) => (
            <label className="field" key={key}>
              {
                ['Kolommen', 'Tussenruimte (px)', 'Binnenruimte (px)', 'Minimale hoogte (px)'][
                  index
                ]
              }
              <input
                type="number"
                min={key === 'columns' ? 1 : 0}
                max={key === 'columns' ? 12 : 2000}
                value={layout[key] ?? (key === 'columns' ? 1 : 0)}
                onChange={(event) =>
                  patchLayout({
                    [key]: Math.max(
                      key === 'columns' ? 1 : 0,
                      Math.min(key === 'columns' ? 12 : 2000, Number(event.target.value))
                    ),
                  })
                }
              />
            </label>
          ))}
          <label className="field">
            Verticaal uitlijnen
            <select
              value={layout.align || 'stretch'}
              onChange={(event) => patchLayout({ align: event.target.value })}
            >
              <option value="stretch">Uitrekken</option>
              <option value="start">Boven</option>
              <option value="center">Midden</option>
              <option value="end">Onder</option>
            </select>
          </label>
          <button className="button secondary wide" onClick={() => action('open-blocks')}>
            Bouwsteen in container toevoegen
          </button>
        </>
      )}
      <div className="field-row">
        {['offsetX', 'offsetY'].map((key, index) => (
          <label className="field" key={key}>
            {index ? 'Verschuif Y (px)' : 'Verschuif X (px)'}
            <input
              type="number"
              min="-1000"
              max="1000"
              value={position[key] || 0}
              onChange={(event) =>
                update(
                  mobile
                    ? { mobile: { ...block.mobile, [key]: Number(event.target.value) } }
                    : { [key]: Number(event.target.value) }
                )
              }
            />
          </label>
        ))}
      </div>
      <label className="field">
        Breedte op {mobile ? 'mobiel' : 'desktop'} (%)
        <input
          type="number"
          min="5"
          max="100"
          value={position.width ?? 100}
          onChange={(event) =>
            update(
              mobile
                ? {
                    mobile: {
                      ...block.mobile,
                      width: Math.max(5, Math.min(100, Number(event.target.value))),
                    },
                  }
                : { width: Math.max(5, Math.min(100, Number(event.target.value))) }
            )
          }
        />
      </label>
      <label className="field">
        Hoeken (px)
        <input
          type="number"
          min="0"
          max="200"
          value={block.radius || 0}
          onChange={(event) => update({ radius: Math.max(0, Number(event.target.value)) })}
        />
      </label>
      <p className="helper-text">
        Selecteer een container om nieuwe bouwstenen daarin te plaatsen. Sleep lagen om te
        herschikken, of kies hierboven een ouder. Verschuivingen laten elementen overlappen.
      </p>
    </div>
  )
}
