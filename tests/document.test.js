/** Documenttests — versie 1.1 | Laatst gewijzigd: 2026-11-16. Publicatievalidatie en onafhankelijke edits. */
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { initialSite } from '../src/data/initialSite.js'
import { createBlock, moveBlock, updateBlock } from '../src/lib/document.js'
import { safeUrl, validateSite, youtubeId } from '../src/lib/validation.js'

// Voorkomt dat onbetrouwbare mediahosts of uitvoerbare links worden doorgelaten.
test('media-URL’s worden veilig herkend', () => {
  assert.equal(youtubeId('https://youtu.be/aqz-KE-bpKQ?t=2'), 'aqz-KE-bpKQ')
  assert.equal(youtubeId('https://www.youtube.com/watch?v=aqz-KE-bpKQ'), 'aqz-KE-bpKQ')
  assert.equal(youtubeId('https://youtube.com.evil.example/watch?v=aqz-KE-bpKQ'), '')
  assert.equal(safeUrl('javascript:alert(1)'), '')
  assert.equal(safeUrl('data:image/svg+xml,script', true), '')
})

// Publicatie weigert dubbele paden, ongeldige video's en kapotte navigatie.
test('publicatie valideert pagina’s en verwijzingen', () => {
  assert.equal(validateSite(initialSite), initialSite)
  const site = structuredClone(initialSite)
  site.pages[1].slug = ''
  assert.throws(() => validateSite(site), /unieke/)
  site.pages[1].slug = 'over'
  site.navigation[0].pageId = 'missing'
  assert.throws(() => validateSite(site), /ontbrekende/)
  site.navigation = []
  site.pages[0].sections[1].url = 'https://example.com/video'
  assert.throws(() => validateSite(site), /YouTube/)
})

// Links, animaties en afbeeldingsinstellingen worden vóór publicatie gecontroleerd.
test('publicatie weigert kapotte links en onbekende instellingen', () => {
  const build = (change) => {
    const site = structuredClone(initialSite)
    change(site)
    return site
  }
  const link = (value) => (site) =>
    site.navigation.push({ id: 'x', label: 'Test', children: [], ...value })
  assert.ok(validateSite(build(link({ kind: 'url', url: 'https://example.com' }))))
  assert.ok(validateSite(build(link({ kind: 'section', pageId: 'home', sectionId: 'contact' }))))
  assert.throws(
    () => validateSite(build(link({ kind: 'url', url: 'javascript:alert(1)' }))),
    /adres/
  )
  assert.throws(
    () => validateSite(build(link({ kind: 'section', pageId: 'home', sectionId: 'weg' }))),
    /ontbrekende sectie/
  )
  assert.throws(
    () =>
      validateSite(
        build((site) => {
          site.settings.footerConfig = { links: [{ id: 'f', label: 'Weg', pageId: 'missing' }] }
        })
      ),
    /ontbrekende pagina/
  )
  const block = (value) => (site) => Object.assign(site.pages[0].sections[0], value)
  assert.throws(() => validateSite(build(block({ animation: 'explode' }))), /animatie/)
  assert.throws(() => validateSite(build(block({ motionTrigger: 'never' }))), /animatie/)
  assert.throws(
    () => validateSite(build(block({ imageSettings: { focusX: 140 } }))),
    /afbeeldingsinstellingen/
  )
  assert.throws(() => validateSite(build(block({ galleryMode: 'spiral' }))), /galerij/)
  assert.ok(validateSite(build(block({ animation: 'stagger', motionTrigger: 'load' }))))
})

// Historie kan alleen betrouwbaar terugzetten als documentbewerkingen oude snapshots behouden.
test('bewerkingen muteren oude versies niet', () => {
  const before = JSON.stringify(initialSite)
  const updated = updateBlock(initialSite, 'home', 'intro', { title: 'Nieuw verhaal' })
  assert.equal(updated.pages[0].sections[0].title, 'Nieuw verhaal')
  const reordered = moveBlock(initialSite, 'home', 0, 2)
  assert.equal(reordered.pages[0].sections[2].id, 'intro')
  assert.equal(JSON.stringify(initialSite), before)
  const block = createBlock('grid')
  block.items[0].title = 'Andere titel'
  assert.equal(JSON.stringify(initialSite), before)
})
