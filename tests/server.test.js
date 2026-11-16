/** Workergrenzen — versie 1.0 | Laatst gewijzigd: 2026-10-29. Afwijzen vóór GitHub wordt benaderd. */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import worker from '../server/worker.js'
import { resolveRepository } from '../server/repositories.js'

// Een bezoeker zonder token kan geen foto's uploaden of opslagbronnen aanmaken.
test('onbevoegde upload wordt geweigerd', async () => {
  const response = await worker.fetch(
    new Request('https://api.example/upload', {
      method: 'POST',
      headers: { Origin: 'http://localhost:5173' },
    }),
    { ALLOWED_ORIGINS: 'http://localhost:5173' }
  )
  assert.equal(response.status, 401)
  assert.match((await response.json()).error, /beheerder/)
})

// CORS staat uitsluitend de ingestelde studio toe en behandelt preflight zonder body.
test('vreemde origins worden geweigerd en preflight werkt', async () => {
  const denied = await worker.fetch(
    new Request('https://api.example/media', { headers: { Origin: 'https://unknown.example' } }),
    { ALLOWED_ORIGINS: 'http://localhost:5173' }
  )
  assert.equal(denied.status, 403)
  const allowed = await worker.fetch(
    new Request('https://api.example/upload', {
      method: 'OPTIONS',
      headers: { Origin: 'http://localhost:5173' },
    }),
    { ALLOWED_ORIGINS: 'http://localhost:5173' }
  )
  assert.equal(allowed.status, 204)
  assert.equal(allowed.headers.get('Access-Control-Allow-Origin'), 'http://localhost:5173')
})

// Een geldig Firebase-account krijgt geen algemene schrijfmacht over willekeurige GitHub-repositories.
test('opslag blijft beperkt tot de gekozen eigenaar en media-prefix', () => {
  const env = { MEDIA_OWNER: 'Allexwnl', MEDIA_REPO: 'Allexwnl/aidan-media-basis' }
  assert.equal(
    resolveRepository(
      new Request('https://api.example/upload?source=Allexwnl/aidan-media-2026'),
      env
    ),
    'Allexwnl/aidan-media-2026'
  )
  assert.throws(
    () =>
      resolveRepository(
        new Request('https://api.example/upload?source=Allexwnl/aidans-portfolio'),
        env
      ),
    /toegestane/
  )
  assert.throws(
    () =>
      resolveRepository(
        new Request('https://api.example/upload?source=other/aidan-media-2026'),
        env
      ),
    /opslagbron/
  )
  assert.throws(
    () =>
      resolveRepository(new Request('https://api.example/upload?source=Allexwnl/../secret'), env),
    /opslagbron/
  )
})
