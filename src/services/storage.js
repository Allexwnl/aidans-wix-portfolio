/** Opslag — versie 1.0 | Laatst gewijzigd: 2026-10-29. Concepten met revisiecontrole en releases. */
import { doc, getDoc, runTransaction } from 'firebase/firestore'
import { db, siteId, firebaseReady } from './firebase.js'
import { validateSite } from '../lib/validation.js'
import { writeSnapshot, readSnapshot, discardSnapshot } from './snapshots.js'
import { saveLocalDraft } from './localStorage.js'

// Leest lokaal of uit Firestore; onleesbare opslag wordt niet stil als succes behandeld.
export async function loadDocument(kind = 'draft') {
  if (!firebaseReady) return JSON.parse(localStorage.getItem(`aidan:${kind}`) || 'null')
  const snapshot = await getDoc(doc(db, 'sites', siteId, 'documents', kind))
  if (!snapshot.exists()) return null
  const manifest = snapshot.data()
  try {
    return { ...manifest, site: await readSnapshot(manifest) }
  } catch (error) {
    // Bij een gelijktijdige nieuwe release kunnen verouderde delen al zijn opgeruimd.
    const current = await getDoc(doc(db, 'sites', siteId, 'documents', kind))
    if (!current.exists() || current.data().snapshotId === manifest.snapshotId) throw error
    return { ...current.data(), site: await readSnapshot(current.data()) }
  }
}

// Schrijft alleen wanneer de opgeslagen revisie nog overeenkomt met de bekende versie.
export async function saveDocument(site, expectedRevision) {
  const payload = { site, revision: expectedRevision + 1, savedAt: new Date().toISOString() }
  if (!firebaseReady) {
    await saveLocalDraft(payload, expectedRevision)
  } else {
    const manifest = {
      ...(await writeSnapshot(site)),
      revision: payload.revision,
      savedAt: payload.savedAt,
    }
    const previous = await runTransaction(db, async (transaction) => {
      const ref = doc(db, 'sites', siteId, 'documents', 'draft')
      const snapshot = await transaction.get(ref)
      if ((snapshot.data()?.revision || 0) !== expectedRevision)
        throw new Error('Er is een nieuwere versie. Exporteer je wijzigingen en herlaad.')
      transaction.set(ref, manifest)
      return snapshot.data()
    })
    // Opruimfouten mogen een al geslaagde conceptsave niet als mislukt presenteren.
    discardSnapshot(previous).catch(() => {})
  }
  return payload
}

// Publiceert een gevalideerd geheel en bewaart de vorige release voor herstel.
export async function publishDocument(site) {
  validateSite(site)
  const payload = { site, savedAt: new Date().toISOString() }
  if (!firebaseReady) {
    const previous = await loadDocument('live')
    if (previous) localStorage.setItem('aidan:previous', JSON.stringify(previous))
    localStorage.setItem('aidan:live', JSON.stringify(payload))
  } else {
    const manifest = { ...(await writeSnapshot(site)), savedAt: payload.savedAt }
    const previous = await runTransaction(db, async (transaction) => {
      const ref = doc(db, 'sites', siteId, 'documents', 'live')
      const old = await transaction.get(ref)
      const older = await transaction.get(doc(db, 'sites', siteId, 'documents', 'previous'))
      if (old.exists())
        transaction.set(doc(db, 'sites', siteId, 'documents', 'previous'), old.data())
      transaction.set(ref, manifest)
      return older.data()
    })
    discardSnapshot(previous).catch(() => {})
  }
  return payload
}
