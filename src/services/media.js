/** Foto-upload — versie 1.0 | Laatst gewijzigd: 2026-10-29. Browsercompressie en geauthenticeerde API. */
import { auth } from './firebase.js'

// Verkleint webfoto's tot maximaal 2400 px; camera-originelen worden niet als archief geüpload.
export async function uploadImage(file, source = '') {
  if (!auth?.currentUser) throw new Error('Log in met Firebase om naar GitHub te uploaden.')
  if (!import.meta.env.VITE_MEDIA_API_URL)
    throw new Error('De GitHub-mediakoppeling is nog niet ingesteld. Zie README.md.')
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 8 * 1024 * 1024)
    throw new Error('Kies JPEG, PNG of WebP van maximaal 8 MB.')
  const image = await createImageBitmap(file)
  const scale = Math.min(1, 2400 / Math.max(image.width, image.height))
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(image.width * scale)
  canvas.height = Math.round(image.height * scale)
  canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height)
  image.close()
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/webp', 0.85))
  if (!blob) throw new Error('Deze foto kon niet worden voorbereid.')
  const token = await auth.currentUser.getIdToken()
  const response = await fetch(
    `${import.meta.env.VITE_MEDIA_API_URL.replace(/\/$/, '')}/upload?source=${encodeURIComponent(source)}`,
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'image/webp' },
      body: blob,
    }
  )
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'Uploaden is mislukt. Probeer opnieuw.')
  return { ...data, name: file.name, width: canvas.width, height: canvas.height }
}

// Leest gedeelde GitHub-media terug zonder private brongegevens aan bezoekers te geven.
export async function listImages(source = '') {
  if (!auth?.currentUser || !import.meta.env.VITE_MEDIA_API_URL) return null
  const token = await auth.currentUser.getIdToken()
  const response = await fetch(
    `${import.meta.env.VITE_MEDIA_API_URL.replace(/\/$/, '')}/media?source=${encodeURIComponent(source)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  )
  const data = await response.json()
  if (!response.ok) throw new Error(data.error || 'De media konden niet worden geladen.')
  return data.assets
}
