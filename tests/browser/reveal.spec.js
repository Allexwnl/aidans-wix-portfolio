/** Onthullingen — versie 1.0 | Laatst gewijzigd: 2026-11-16. Trigger, mobiele override en na elkaar verschijnen. */
import { test, expect } from '@playwright/test'
import { initialSite } from '../../src/data/initialSite.js'

// Zet een live site klaar waarin de laatste bouwsteen van de homepage de opgegeven animatie heeft.
async function openWithMotion(page, patch, width = 1440) {
  const site = structuredClone(initialSite)
  Object.assign(site.pages[0].sections.at(-1), { duration: 200, ...patch })
  await page.addInitScript(
    (site) => localStorage.setItem('aidan:live', JSON.stringify({ site, revision: 1 })),
    site
  )
  await page.setViewportSize({ width, height: 900 })
  await page.goto('/?demo=1')
  await expect(page.locator('h1')).toBeVisible()
  return page.locator(`[data-section-id="${site.pages[0].sections.at(-1).id}"] > .node-motion`)
}

// Een bouwsteen onder de vouw is eerst verborgen en verschijnt zodra hij in beeld schuift.
test('animatie start pas bij scrollen en eindigt zichtbaar', async ({ page }) => {
  const layer = await openWithMotion(page, { animation: 'rise' })
  await expect(layer).toHaveClass(/motion-rise/)
  await expect(layer).not.toHaveClass(/in-view/)
  await expect(layer).toHaveCSS('opacity', '0')
  await layer.scrollIntoViewIfNeeded()
  await expect(layer).toHaveClass(/in-view/)
  await expect(layer).toHaveCSS('opacity', '1')
  await expect(layer).toHaveCSS('transform', 'none')
})

// 'Direct bij openen' wacht niet op scrollen, ook niet voor inhoud onderaan de pagina.
test('trigger direct bij openen toont de bouwsteen zonder scrollen', async ({ page }) => {
  const layer = await openWithMotion(page, { animation: 'fade', motionTrigger: 'load' })
  await expect(layer).toHaveClass(/in-view/)
  await expect(layer).toHaveCSS('opacity', '1')
  expect(await page.evaluate(() => scrollY)).toBe(0)
})

// Op een telefoon geldt de mobiele animatie; desktop houdt het eigen effect.
test('mobiele animatie-override geldt alleen op mobiel', async ({ page }) => {
  const patch = { animation: 'slide', mobile: { motion: { animation: 'fade', duration: 300 } } }
  const desktop = await openWithMotion(page, patch)
  await expect(desktop).toHaveClass(/motion-slide/)
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(desktop).toHaveClass(/motion-fade/)
  await expect(desktop).not.toHaveClass(/motion-slide/)
  await desktop.scrollIntoViewIfNeeded()
  await expect(desktop).toHaveClass(/in-view/)
  await expect(desktop).toHaveCSS('opacity', '1')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

// Onderdelen krijgen een oplopende vertraging en staan na afloop allemaal zichtbaar.
test('na elkaar verschijnen nummert de onderdelen en toont ze allemaal', async ({ page }) => {
  const layer = await openWithMotion(page, { animation: 'stagger' })
  const items = layer.locator('[data-stagger]')
  expect(await items.count()).toBeGreaterThan(1)
  await expect(items.first()).toHaveCSS('opacity', '0')
  await layer.scrollIntoViewIfNeeded()
  await expect(layer).toHaveClass(/in-view/)
  for (const item of await items.all()) await expect(item).toHaveCSS('opacity', '1')
  expect(
    await items.last().evaluate((element) => element.style.getPropertyValue('--stagger-index'))
  ).not.toBe('0')
})

// In de editor kies je de trigger; de keuze komt in het concept en blijft bewerkbaar zichtbaar.
test('editor bewaart trigger en mobiele animatie apart', async ({ page }) => {
  await page.goto('/studio?demo=1')
  const canvas = page.frameLocator('iframe.canvas-frame')
  await expect(canvas.locator('h1')).toBeVisible()
  await page.getByRole('button', { name: 'Animatie', exact: true }).click()
  await page.getByLabel('Start').selectOption('load')
  const effect = page.locator('.motion-settings select').first()
  await effect.selectOption('rise')
  await page.getByRole('button', { name: 'Mobiel voorbeeld', exact: true }).click()
  await expect(effect).toHaveValue('')
  await effect.selectOption('fade')
  await expect(canvas.locator('.is-selected > .node-motion')).toHaveClass(/motion-fade/)
  await expect(canvas.locator('.is-selected > .node-motion')).toHaveCSS('opacity', '1')
  await page.getByRole('button', { name: 'Desktopvoorbeeld', exact: true }).click()
  await expect(canvas.locator('.is-selected > .node-motion')).toHaveClass(/motion-rise/)
  await expect(page.getByLabel('Start')).toHaveValue('load')
})
