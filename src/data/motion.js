/** Bewegingspresets — versie 1.0 | Laatst gewijzigd: 2026-10-29. Gedeelde keuzes voor editor en renderer. */
export const motionPresets = [
  ['none', 'Geen animatie'],
  ['fade', 'Rustig vervagen'],
  ['rise', 'Omhoog verschijnen'],
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
export const motionEasings = {
  cinematic: 'cubic-bezier(.22,1,.36,1)',
  gentle: 'ease-in-out',
  linear: 'linear',
}
