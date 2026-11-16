/** Geneste weergave — versie 1.1 | Laatst gewijzigd: 2026-11-16. Eén renderer voor alle dieptes. */
import { PlacementHandles } from './PlacementHandles.jsx'
import { SectionContent } from './SectionContent.jsx'
import { motionEasings, motionDefaults } from '../../data/motion.js'
import { resolveMotion } from '../../lib/motion.js'

// Indeling en beweging hebben aparte lagen zodat offsets niet met animatietransforms botsen.
export function NodeRenderer({
  block,
  editing,
  selected,
  onSelect,
  onEdit,
  site,
  onNavigate,
  nested = false,
  compact = false,
}) {
  if (!editing && block.visibility?.enabled === false) return null
  const layout = block.layout || {}
  const mobile = { ...layout, columns: 1, ...block.mobile?.layout }
  // Geldende animatie: desktopwaarden, op mobiel aangevuld met de mobiele override.
  const motion = resolveMotion(block, compact)
  return (
    <section
      data-section-id={block.id}
      className={`site-section node-section ${nested ? 'nested-section' : ''} ${block.visibility?.enabled === false ? 'disabled-block' : ''} ${editing ? 'is-editable' : ''} ${editing && selected === block.id ? 'is-selected' : ''}`}
      style={{
        '--section-space': `${block.spacing ?? 60}px`,
        '--section-width': `${block.width || 100}%`,
        '--mobile-width': `${block.mobile?.width ?? 100}%`,
        '--section-align': block.align || 'left',
        '--mobile-space': `${block.mobile?.spacing ?? (nested ? 12 : 35)}px`,
        '--mobile-font': `${block.mobile?.fontSize || 48}px`,
        '--section-font': `${block.fontSize || 90}px`,
        '--section-gutter': block.fullBleed || nested ? '0%' : '5%',
        '--offset-x': `${block.offsetX || 0}px`,
        '--offset-y': `${block.offsetY || 0}px`,
        '--mobile-offset-x': `${block.mobile?.offsetX || 0}px`,
        '--mobile-offset-y': `${block.mobile?.offsetY || 0}px`,
        background: block.background || 'transparent',
        color: block.color || 'inherit',
        borderRadius: `${block.radius || 0}px`,
      }}
      onClick={
        editing
          ? (event) => {
              event.stopPropagation()
              onSelect(block.id)
            }
          : undefined
      }
    >
      {editing && selected === block.id && <span className="selection-caption">{block.label}</span>}
      {editing && selected === block.id && <PlacementHandles block={block} onEdit={onEdit} />}
      <div
        className={`node-motion motion-section motion-${motion.animation} ${editing ? 'motion-editing' : ''}`}
        data-repeat={motion.repeat ? 'true' : undefined}
        data-trigger={motion.trigger}
        style={{
          '--motion-distance': `${motion.distance}px`,
          // Sterkte zonder eenheid: schaalt zoom, kanteling en onscherpte mee met de afstand.
          '--motion-strength': motion.distance / motionDefaults.distance,
          '--motion-duration': `${motion.duration}ms`,
          '--motion-delay': `${motion.delay}ms`,
          '--motion-easing': motionEasings[motion.easing] || motionEasings.cinematic,
        }}
      >
        {block.type === 'container' ? (
          <div
            className="container-block section-inner"
            style={{
              '--layout-display': layout.mode === 'row' ? 'flex' : 'grid',
              '--layout-columns': layout.mode === 'stack' ? 1 : layout.columns || 2,
              '--layout-gap': `${layout.gap ?? 24}px`,
              '--layout-padding': `${layout.padding ?? 24}px`,
              '--layout-height': `${layout.minHeight ?? 180}px`,
              '--layout-align': layout.align || 'stretch',
              '--mobile-layout-display': mobile.mode === 'row' ? 'flex' : 'grid',
              '--mobile-layout-columns': mobile.mode === 'stack' ? 1 : mobile.columns,
              '--mobile-layout-gap': `${mobile.gap ?? 16}px`,
              '--mobile-layout-padding': `${mobile.padding ?? 16}px`,
              '--mobile-layout-height': `${mobile.minHeight ?? 100}px`,
              '--mobile-layout-align': mobile.align || 'stretch',
            }}
          >
            {block.children?.map((child) => (
              <NodeRenderer
                key={child.id}
                {...{ editing, selected, onSelect, onEdit, site, onNavigate, compact }}
                block={child}
                nested
              />
            ))}
            {editing && !block.children?.length && (
              <button className="empty-container" onClick={() => onSelect(block.id)}>
                Lege container · voeg een bouwsteen toe via Toevoegen
              </button>
            )}
          </div>
        ) : (
          <SectionContent {...{ block, editing, onEdit, site, onNavigate }} />
        )}
      </div>
    </section>
  )
}
