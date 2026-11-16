/** Bronnenclient — versie 1.0 | Laatst gewijzigd: 2026-10-29. Beveiligde toegang tot opslagbeheer. */
import { auth } from './firebase.js'

// Verstuurt een Firebase-token uitsluitend naar de vooraf ingestelde media-API.
export async function sourceRequest(name) {
  if (!auth?.currentUser || !import.meta.env.VITE_MEDIA_API_URL)
    throw new Error(
      'De GitHub-opslagkoppeling is nog niet ingesteld. Zie de aansluitstappen in README.md.'
    )
  const token = await auth.currentUser.getIdToken()
  const response = await fetch(`${import.meta.env.VITE_MEDIA_API_URL.replace(/\/$/, '')}/sources`, {
    method: name ? 'POST' : 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
      ...(name ? { 'Content-Type': 'application/json' } : {}),
    },
    ...(name ? { body: JSON.stringify({ name }) } : {}),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Opslagbronnen konden niet worden geladen.')
  return data
}
