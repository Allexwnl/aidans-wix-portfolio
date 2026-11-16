/** Opslagbronnen — versie 1.0 | Laatst gewijzigd: 2026-10-29. Publieke mediarepositories op één account. */
// Roept GitHub aan zonder de servertoken aan de browser terug te geven.
export async function github(env, path, options = {}) {
  return fetch(`https://api.github.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${env.GITHUB_TOKEN}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json',
      'User-Agent': 'AidanStudio',
      'X-GitHub-Api-Version': '2022-11-28',
    },
  })
}

// Alleen de vaste bron of mediarepositories met onze prefix op het vaste account zijn toegestaan.
export function resolveRepository(request, env) {
  const requested = new URL(request.url).searchParams.get('source') || env.MEDIA_REPO
  const [owner, name, extra] = (requested || '').split('/')
  if (
    extra ||
    !owner ||
    !name ||
    owner.toLowerCase() !== env.MEDIA_OWNER?.toLowerCase() ||
    !/^[\w.-]+$/.test(name)
  )
    throw new Error('Kies een ingestelde opslagbron.')
  if (requested !== env.MEDIA_REPO && !/^aidan-media-[a-z0-9-]{1,60}$/.test(name))
    throw new Error('Deze repository is geen toegestane opslagbron.')
  return requested
}

// Ontdekt openbare bronnen via GitHub zodat een tweede computer dezelfde opslagkeuze krijgt.
export async function listSources(env) {
  const sources = []
  for (let page = 1; page <= 5; page++) {
    const response = await github(
      env,
      `/users/${encodeURIComponent(env.MEDIA_OWNER)}/repos?per_page=100&sort=created&page=${page}`
    )
    if (!response.ok) throw new Error('Opslagbronnen konden niet worden geladen.')
    const repositories = await response.json()
    sources.push(
      ...repositories
        .filter(
          (repo) =>
            !repo.private &&
            (repo.full_name === env.MEDIA_REPO || /^aidan-media-[a-z0-9-]{1,60}$/.test(repo.name))
        )
        .map((repo) => ({
          repository: repo.full_name,
          name: repo.name.replace(/^aidan-media-/, ''),
          sizeKb: repo.size,
          url: repo.html_url,
        }))
    )
    if (repositories.length < 100) break
  }
  return sources
}

// Aanmaken is een bewuste beheeractie en vereist een GitHub-token met geschikte rechten.
export async function createSource(request, env) {
  if (env.ALLOW_CREATE_SOURCES !== 'true')
    throw new Error('Nieuwe opslagbronnen aanmaken is nog niet ingeschakeld op de server.')
  if (Number(request.headers.get('Content-Length') || 0) > 1024)
    throw new Error('De aanvraag is te groot.')
  const text = await request.text()
  if (text.length > 1024) throw new Error('De aanvraag is te groot.')
  const { name } = JSON.parse(text)
  if (!/^[a-z0-9-]{1,60}$/.test(name || ''))
    throw new Error('Gebruik 1 tot 60 kleine letters, cijfers en streepjes.')
  const identity = await github(env, '/user')
  if (!identity.ok || (await identity.json()).login.toLowerCase() !== env.MEDIA_OWNER.toLowerCase())
    throw new Error('De GitHub-koppeling hoort niet bij het ingestelde account.')
  const response = await github(env, '/user/repos', {
    method: 'POST',
    body: JSON.stringify({
      name: `aidan-media-${name}`,
      private: false,
      auto_init: true,
      description: 'Openbare portfoliofoto’s, beheerd vanuit Aidan Studio',
    }),
  })
  if (!response.ok)
    throw new Error(
      response.status === 422
        ? 'Deze opslagnaam bestaat al. Kies een andere naam.'
        : 'GitHub staat aanmaken niet toe. Controleer de serverrechten.'
    )
  const repo = await response.json()
  return { repository: repo.full_name, name, sizeKb: repo.size, url: repo.html_url }
}
