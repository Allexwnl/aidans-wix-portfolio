/** Bewegingsinstellingen — versie 1.0 | Laatst gewijzigd: 2026-11-16. Desktopwaarden met mobiele override. */
import { motionDefaults, motionPresets, motionTriggers } from '../data/motion.js'

// Geeft de instellingen die nu gelden; op mobiel gaan ingevulde mobiele waarden voor.
export function resolveMotion(block, compact = false) {
  const override = (compact && block.mobile?.motion) || {}
  return {
    animation: override.animation || block.animation || 'none',
    duration: override.duration || block.duration || motionDefaults.duration,
    delay: override.delay ?? block.delay ?? motionDefaults.delay,
    distance: override.distance || block.motionDistance || motionDefaults.distance,
    easing: block.easing || 'cinematic',
    trigger: block.motionTrigger || 'view',
    repeat: !!block.motionRepeat,
  }
}

// Weigert onbekende presets of triggers, zodat een import geen onzichtbare inhoud oplevert.
export function validateMotion(block) {
  const known = (list, value) => value === undefined || list.some(([id]) => id === value)
  if (
    !known(motionPresets, block.animation) ||
    !known(motionPresets, block.mobile?.motion?.animation || undefined) ||
    !known(motionTriggers, block.motionTrigger)
  )
    throw new Error(`Onbekende animatie-instelling bij ${block.label}.`)
}
