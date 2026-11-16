/** Firestore-snapshots — versie 1.0 | Laatst gewijzigd: 2026-10-29. Gesplitste, onveranderlijke inhoud. */
import { doc, getDoc, writeBatch } from 'firebase/firestore'
import { db, siteId } from './firebase.js'

// Schrijft begrensde tekstblokken; de hoofdverwijzing verandert pas nadat alle blokken bestaan.
export async function writeSnapshot(site) {
  const json = JSON.stringify(site)
  if (new TextEncoder().encode(json).length > 8 * 1024 * 1024)
    throw new Error(
      'Deze site bevat te veel inhoud voor één publicatie. Verklein de inhoud of exporteer voor verdere uitbreiding.'
    )
  const snapshotId = crypto.randomUUID()
  const batch = writeBatch(db)
  const parts = Math.ceil(json.length / 160000)
  for (let index = 0; index < parts; index++)
    batch.set(doc(db, 'sites', siteId, 'snapshots', snapshotId, 'chunks', String(index)), {
      text: json.slice(index * 160000, (index + 1) * 160000),
    })
  await batch.commit()
  return { snapshotId, parts, schemaVersion: site.schemaVersion }
}

// Leest alleen de delen uit het manifest; ontbrekende delen maken laden expliciet ongeldig.
export async function readSnapshot(manifest) {
  if (
    !/^[\w-]+$/.test(manifest.snapshotId || '') ||
    !Number.isInteger(manifest.parts) ||
    manifest.parts < 1 ||
    manifest.parts > 100
  )
    throw new Error('Ongeldige inhoudsverwijzing.')
  const parts = await Promise.all(
    Array.from({ length: manifest.parts }, (_, index) =>
      getDoc(doc(db, 'sites', siteId, 'snapshots', manifest.snapshotId, 'chunks', String(index)))
    )
  )
  if (parts.some((part) => !part.exists() || typeof part.data().text !== 'string'))
    throw new Error('Niet alle onderdelen van deze versie zijn beschikbaar.')
  return JSON.parse(parts.map((part) => part.data().text).join(''))
}

// Ruimt alleen een vervangen snapshot op als geen concept of herstelbare release ernaar verwijst.
export async function discardSnapshot(manifest) {
  if (!manifest?.snapshotId || !manifest.parts) return
  const pointers = await Promise.all(
    ['draft', 'live', 'previous'].map((kind) => getDoc(doc(db, 'sites', siteId, 'documents', kind)))
  )
  if (pointers.some((pointer) => pointer.data()?.snapshotId === manifest.snapshotId)) return
  const batch = writeBatch(db)
  for (let index = 0; index < manifest.parts; index++)
    batch.delete(
      doc(db, 'sites', siteId, 'snapshots', manifest.snapshotId, 'chunks', String(index))
    )
  await batch.commit()
}
