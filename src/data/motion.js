/** Bewegingspresets — versie 1.1 | Laatst gewijzigd: 2026-11-16. Gedeelde keuzes voor editor en renderer. */
// Alle effecten die een bouwsteen kan krijgen; de sleutel wordt de CSS-klasse motion-<sleutel>.
export const motionPresets = [
  ['none', 'Geen animatie'],
  ['fade', 'Rustig vervagen'],
  ['rise', 'Omhoog verschijnen'],
  ['stagger', 'Na elkaar verschijnen'],
  ['reveal', 'Filmisch onthullen'],
  ['zoom', 'Tekst / beeld inzoomen'],
  ['curtain', 'Filmdoek van onderaf'],
  ['iris', 'Breedbeeld opent'],
  ['slide', 'Van links naar rechts'],
  ['slide-right', 'Van rechts naar links'],
  ['drop', 'Van boven naar beneden'],
  ['tilt', 'Draaien en rechtzetten'],
  ['scale-out', 'Uitzoomen naar rust'],
  ['soft-focus', 'Van onscherp naar scherp'],
]
// Bewegingscurves die de editor aanbiedt.
export const motionEasings = {
  cinematic: 'cubic-bezier(.22,1,.36,1)',
  gentle: 'ease-in-out',
  linear: 'linear',
}
// Het moment waarop een animatie start.
export const motionTriggers = [
  ['view', 'Zodra het in beeld komt'],
  ['center', 'Pas verder in beeld'],
  ['load', 'Direct bij het openen van de pagina'],
]
// Standaardwaarden die editor en renderer delen.
export const motionDefaults = { duration: 800, delay: 0, distance: 45 }
