/** Afbeeldingsinstellingen — versie 1.0 | Laatst gewijzigd: 2026-11-16. Verhouding, uitsnede, focuspunt en fotolabel. */
// Beeldverhoudingen die de editor aanbiedt; 'auto' laat de standaard van de bouwsteen staan.
export const imageRatios = [
  ['auto', 'Standaard'],
  ['16/9', 'Liggend 16:9'],
  ['3/2', 'Liggend 3:2'],
  ['4/3', 'Liggend 4:3'],
  ['1/1', 'Vierkant'],
  ['3/4', 'Staand 3:4'],
  ['21/9', 'Breedbeeld 21:9'],
]
// Optionele labels; 'onbewerkt' betekent een foto zonder creatieve nabewerking.
export const photoLabels = [
  ['', 'Geen label'],
  ['raw', 'Onbewerkt'],
  ['edited', 'Bewerkt'],
]

// Vertaalt de instellingen naar inline stijl voor een <img>; het focuspunt bepaalt de uitsnede.
export function imageStyle(settings = {}) {
  return {
    aspectRatio: settings.ratio && settings.ratio !== 'auto' ? settings.ratio : undefined,
    objectFit: settings.fit === 'contain' ? 'contain' : undefined,
    objectPosition: `${settings.focusX ?? 50}% ${settings.focusY ?? 50}%`,
  }
}

// Geeft de zichtbare tekst van een fotolabel, of een lege tekst zonder label.
export function photoLabelText(settings = {}) {
  return settings.label ? photoLabels.find(([id]) => id === settings.label)?.[1] || '' : ''
}

// Weigert onbekende waarden, zodat een import geen kapotte stijl of vreemde tekst meeneemt.
export function validateImageSettings(settings) {
  if (settings === undefined) return
  const inList = (list, value) => value === undefined || list.some(([id]) => id === value)
  const percent = (value) =>
    value === undefined || (typeof value === 'number' && value >= 0 && value <= 100)
  if (
    !settings ||
    typeof settings !== 'object' ||
    !inList(imageRatios, settings.ratio) ||
    !inList(photoLabels, settings.label) ||
    ![undefined, 'cover', 'contain'].includes(settings.fit) ||
    !percent(settings.focusX) ||
    !percent(settings.focusY) ||
    (settings.alt !== undefined && typeof settings.alt !== 'string')
  )
    throw new Error('Controleer de afbeeldingsinstellingen.')
}
