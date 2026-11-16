/** Zichtbaarheid — versie 1.0 | Laatst gewijzigd: 2026-11-04. Verbergen zonder inhoud te wissen. */
// Uitgeschakelde onderdelen houden hun tekst en stijl, zodat aanzetten niets verliest.
export function VisibilityPanel({ block, update }) {
  const fields = [['enabled', 'Bouwsteen tonen']]
  if (!['container', 'columns'].includes(block.type)) fields.push(['title', 'Titel tonen'])
  if (['hero', 'text', 'contact', 'video', 'gallery'].includes(block.type))
    fields.push(['text', 'Tekst tonen'])
  if (block.type === 'hero') fields.push(['caption', 'Introductietekst tonen'])
  if (block.type === 'gallery')
    fields.push(['itemCaptions', 'Fotobijschriften tonen'], ['controls', 'Carouselknoppen tonen'])
  if (block.type === 'video') fields.push(['metadata', 'Projectgegevens tonen'])
  if (block.type === 'grid') fields.push(['filters', 'Projectfilters tonen'])
  if (block.type === 'contact') fields.push(['button', 'Contactknop tonen'])
  return (
    <div className="settings-group">
      <h3>Onderdelen aan / uit</h3>
      {fields.map(([key, label]) => (
        <label className="toggle-row" key={key}>
          {label}
          <input
            type="checkbox"
            checked={block.visibility?.[key] !== false}
            onChange={(event) =>
              update({ visibility: { ...block.visibility, [key]: event.target.checked } })
            }
          />
        </label>
      ))}
      <p className="helper-text">
        Je inhoud blijft bewaard. Een hele uitgeschakelde bouwsteen blijft herkenbaar in de editor
        en verdwijnt in het voorbeeld.
      </p>
    </div>
  )
}
