/** Editorcontracten — versie 1.0 | Laatst gewijzigd: 2026-10-29. Geneste opslag en veilige import. */
import test from 'node:test'
import assert from 'node:assert/strict'
import { initialSite } from '../src/data/initialSite.js'
import { createBlock, updateBlock } from '../src/lib/document.js'
import { locateBlock, insertBlock, cloneBlock } from '../src/lib/tree.js'
import { relocateBlock } from '../src/lib/nesting.js'
import { validateSite } from '../src/lib/validation.js'
import { removeFont } from '../src/lib/fonts.js'

// Verplaatsen bewaart alle inhoud en kan geen ouder in zijn eigen kind plaatsen.
test('geneste updates, kopieën en herplaatsen blijven onafhankelijk', () => {
  const parent = createBlock('container')
  const child = createBlock('container')
  const text = createBlock('text')
  const original = insertBlock(insertBlock([parent], child, parent.id), text, child.id)
  const site = structuredClone(initialSite)
  site.pages[0].sections = original
  const updated = updateBlock(site, 'home', text.id, { title: 'Diep gewijzigd' })
  assert.equal(locateBlock(updated.pages[0].sections, text.id).node.title, 'Diep gewijzigd')
  assert.notEqual(locateBlock(original, text.id).node.title, 'Diep gewijzigd')
  assert.equal(relocateBlock(original, parent.id, child.id), original)
  const moved = relocateBlock(original, text.id, '', 0)
  assert.equal(moved[0].id, text.id)
  assert.equal(locateBlock(moved, child.id).node.children.length, 0)
  const copy = cloneBlock(parent)
  assert.notEqual(copy.id, parent.id)
  const deepCopy = cloneBlock(original[0])
  assert.notEqual(deepCopy.children[0].children[0].id, text.id)
  assert.doesNotThrow(() => validateSite(JSON.parse(JSON.stringify(updated))))
})

// Malafide of kapotte tekststructuren mogen ook diep in een container niet publiceren.
test('geneste validatie weigert dubbele ids en uitvoerbare tekstopmaak', () => {
  const site = structuredClone(initialSite)
  const container = createBlock('container')
  container.children = [createBlock('text')]
  site.pages[0].sections = [container]
  container.children[0].richText = {
    title: { plain: 'tekst', nodes: [{ tag: 'script', children: [{ text: 'alert(1)' }] }] },
  }
  assert.throws(() => validateSite(site), /tekstopmaak/)
  container.children[0].richText.title.nodes = [
    { tag: 'a', href: 'javascript:alert(1)', children: [{ text: 'klik' }] },
  ]
  assert.throws(() => validateSite(site), /link/)
  delete container.children[0].richText
  container.children[0].id = container.id
  assert.throws(() => validateSite(site), /identificatie/)
})

// Een verwijderd font laat geen verweesde verwijzingen achter in mobiele of geneste inhoud.
test('fontverwijzingen herstellen bij verwijderen en broncontrole bij import', () => {
  const site = structuredClone(initialSite)
  const family = 'aidan-font-12345678-1234-1234-1234-123456789abc'
  site.fonts = [{ id: 'font', family, name: 'Eigen font', data: 'data:font/woff2;base64,d09GMg==' }]
  site.theme.font = family
  const parent = createBlock('container')
  parent.children = [
    {
      ...createBlock('text'),
      typography: { title: { fontFamily: family } },
      mobile: { typography: { text: { fontFamily: family } } },
    },
  ]
  site.pages[0].sections = [parent]
  const removed = removeFont(site, family)
  assert.equal(removed.theme.font, 'Arial')
  assert.equal(removed.pages[0].sections[0].children[0].mobile.typography.text.fontFamily, '')
  assert.doesNotThrow(() => validateSite(removed))
  site.fonts[0].data = 'https://untrusted.example/font.woff2'
  assert.throws(() => validateSite(site), /lettertype/)
})
