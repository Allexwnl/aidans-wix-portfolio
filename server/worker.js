/** GitHub-media-API — versie 1.0 | Laatst gewijzigd: 2026-10-29. Vaste repository, beperkte rechten. */
import { authorize } from './auth.js'
import { github, resolveRepository, listSources, createSource } from './repositories.js'

// Geeft JSON met beperkte CORS-toegang terug; private tokenwaarden verschijnen nooit in fouten.
function respond(data, status, origin) {
  return new Response(status === 204 ? null : JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Authorization, Content-Type',
      Vary: 'Origin',
      'Cache-Control': 'no-store',
    },
  })
}

// De handler accepteert uitsluitend toegestane origins en geverifieerde Firebase-beheerders.
async function handleRequest(request, env) {
  const origin = request.headers.get('Origin') || ''
  const allowed = (env.ALLOWED_ORIGINS || '').split(',').map((value) => value.trim())
  if (!origin || !allowed.includes(origin))
    return respond({ error: 'Deze website heeft geen toegang.' }, 403, 'null')
  if (request.method === 'OPTIONS') return respond({}, 204, origin)
  try {
    await authorize(request, env)
  } catch {
    return respond({ error: 'Log in als de toegestane beheerder.' }, 401, origin)
  }
  if (!/^[\w-]+$/.test(env.MEDIA_OWNER || '') || !env.GITHUB_TOKEN)
    return respond({ error: 'De mediarepository is nog niet ingesteld.' }, 503, origin)
  try {
    const path = new URL(request.url).pathname
    if (path === '/sources' && request.method === 'GET')
      return respond({ sources: await listSources(env) }, 200, origin)
    if (path === '/sources' && request.method === 'POST') {
      try {
        return respond({ source: await createSource(request, env) }, 201, origin)
      } catch (error) {
        return respond({ error: error.message }, 400, origin)
      }
    }
    let repository
    try {
      repository = resolveRepository(request, env)
    } catch (error) {
      return respond({ error: error.message }, 400, origin)
    }
    const info = await github(env, `/repos/${repository}`)
    if (!info.ok || (await info.json()).private)
      return respond({ error: 'Kies een bereikbare openbare mediarepository.' }, 400, origin)
    const scoped = { ...env, MEDIA_REPO: repository }
    if (path === '/upload' && request.method === 'POST')
      return await upload(request, scoped, origin)
    if (path === '/media' && request.method === 'GET') return await listMedia(scoped, origin)
    return respond({ error: 'Onbekende actie.' }, 404, origin)
  } catch {
    return respond({ error: 'GitHub is tijdelijk niet bereikbaar. Probeer opnieuw.' }, 502, origin)
  }
}

// Schrijft alleen echte WebP-foto's onder een willekeurig, versiegebonden pad.
async function upload(request, env, origin) {
  if (request.headers.get('Content-Type') !== 'image/webp')
    return respond({ error: 'Alleen voorbereide WebP-afbeeldingen zijn toegestaan.' }, 415, origin)
  const reader = request.body.getReader()
  const chunks = []
  let total = 0
  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    total += value.length
    if (total > 3 * 1024 * 1024) {
      await reader.cancel()
      return respond(
        { error: 'De foto is na compressie nog te groot (maximaal 3 MB).' },
        413,
        origin
      )
    }
    chunks.push(value)
  }
  const bytes = new Uint8Array(total)
  let offset = 0
  for (const chunk of chunks) {
    bytes.set(chunk, offset)
    offset += chunk.length
  }
  if (
    total < 12 ||
    String.fromCharCode(...bytes.slice(0, 4)) !== 'RIFF' ||
    String.fromCharCode(...bytes.slice(8, 12)) !== 'WEBP'
  )
    return respond({ error: 'Dit bestand is geen geldige WebP-foto.' }, 415, origin)
  let binary = ''
  for (let index = 0; index < bytes.length; index += 8192)
    binary += String.fromCharCode(...bytes.slice(index, index + 8192))
  const path = `media/${crypto.randomUUID()}.webp`
  const result = await fetch(`https://api.github.com/repos/${env.MEDIA_REPO}/contents/${path}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'AidanStudio',
      'X-GitHub-Api-Version': '2022-11-28',
    },
    body: JSON.stringify({ message: 'Foto toegevoegd via Aidan Studio', content: btoa(binary) }),
  })
  if (!result.ok)
    return respond(
      {
        error:
          result.status === 403 || result.status === 429
            ? 'GitHub-rechten of de API-limiet blokkeren deze upload.'
            : 'GitHub kon de foto niet opslaan. Controleer de repository en rechten.',
      },
      502,
      origin
    )
  const data = await result.json()
  return respond(
    {
      url: `https://raw.githubusercontent.com/${env.MEDIA_REPO}/${data.commit.sha}/${path}`,
      name: path.split('/').pop(),
      path,
      repository: env.MEDIA_REPO,
    },
    201,
    origin
  )
}

// Haalt bestaande uploads opnieuw op, ook wanneer een andere computer wordt gebruikt.
async function listMedia(env, origin) {
  const response = await fetch(`https://api.github.com/repos/${env.MEDIA_REPO}/contents/media`, {
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'AidanStudio',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
  if (response.status === 404) return respond({ assets: [] }, 200, origin)
  if (!response.ok)
    return respond({ error: 'De mediabibliotheek kon niet worden geladen.' }, 502, origin)
  const entries = await response.json()
  // Een vaste commitreferentie voor bestaande beelden vereist de repository-HEAD.
  const head = await fetch(`https://api.github.com/repos/${env.MEDIA_REPO}/commits?per_page=1`, {
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'User-Agent': 'AidanStudio',
    },
  })
  if (!head.ok)
    return respond({ error: 'De beeldversies konden niet worden gelezen.' }, 502, origin)
  const commits = await head.json()
  return respond(
    {
      assets: entries
        .filter((entry) => entry.type === 'file' && entry.name.endsWith('.webp'))
        .map((entry) => ({
          name: entry.name,
          path: entry.path,
          url: `https://raw.githubusercontent.com/${env.MEDIA_REPO}/${commits[0].sha}/${entry.path}`,
        })),
    },
    200,
    origin
  )
}

export default { fetch: handleRequest }
