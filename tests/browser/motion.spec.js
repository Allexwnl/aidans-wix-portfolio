/** Filmische interacties — versie 1.1 | Laatst gewijzigd: 2026-11-16. Mobiel, focus en minder beweging. */
import { test, expect } from '@playwright/test'
import { initialSite } from '../../src/data/initialSite.js'

// De iframebron wordt gemockt; dit controleert bediening en opruimen, geen YouTube-netwerkkwaliteit.
test('filmische preset en bioscoopvenster in het editorvoorbeeld', async ({ page }) => {
  await page.route('https://www.youtube-nocookie.com/**', (route) =>
    route.fulfill({
      contentType: 'text/html',
      body: '<html><body style="background:black;color:white">Filmspeler test</body></html>',
    })
  )
  await page.goto('/studio?demo=1')
  const canvas = page.frameLocator('iframe.canvas-frame')
  await expect(canvas.locator('h1')).toBeVisible()
  await page.getByRole('button', { name: 'Uitgelichte film', exact: true }).click()
  await page.getByRole('textbox', { name: 'YouTube-link' }).fill('https://youtu.be/dQw4w9WgXcQ')
  await page.getByRole('button', { name: 'Pas filmische projectstijl toe' }).click()
  await page.getByRole('button', { name: 'Voorbeeld', exact: true }).click()
  await canvas.getByRole('button', { name: 'Bekijk Tussen land en licht' }).click()
  await expect(canvas.getByRole('dialog')).toBeVisible()
  await expect(canvas.locator('.cinema-screen iframe')).toHaveAttribute('src', /autoplay=1/)
  await page.screenshot({ path: 'test-results/cinema-desktop.png' })
  await canvas.getByRole('button', { name: 'Film sluiten ×' }).press('Escape')
  await expect(canvas.getByRole('dialog')).toHaveCount(0)
  await expect(canvas.locator('.film-player')).toHaveCount(0)
  await expect(canvas.getByRole('button', { name: 'Bekijk Tussen land en licht' })).toBeFocused()
  await page.getByRole('button', { name: 'Mobiel voorbeeld', exact: true }).click()
  await canvas.getByRole('button', { name: 'Bekijk Tussen land en licht' }).click()
  await expect(canvas.getByRole('dialog')).toBeVisible()
  expect(
    await canvas.getByRole('dialog').evaluate((element) => element.getBoundingClientRect().width)
  ).toBeLessThanOrEqual(390)
  await canvas.getByRole('button', { name: 'Film sluiten ×' }).click()
  await expect(canvas.getByRole('dialog')).toHaveCount(0)
  await page.screenshot({ path: 'test-results/film-mobile.png' })
})

// Publieke navigatie gebruikt echte URL's en browsergeschiedenis, met dezelfde overgang op mobiel.
test('filmdoek tussen pagina’s werkt op desktop en mobiel', async ({ page }) => {
  const site = structuredClone(initialSite)
  site.settings.pageTransition = 'curtain'
  site.settings.transitionDuration = 500
  await page.addInitScript(
    (site) => localStorage.setItem('aidan:live', JSON.stringify({ site, revision: 1 })),
    site
  )
  for (const width of [1440, 390]) {
    await page.setViewportSize({ width, height: 900 })
    await page.goto('/?demo=1')
    await expect(page.locator('h1')).toBeVisible()
    if (width === 390) await page.getByRole('button', { name: 'Menu +' }).click()
    await page.getByRole('link', { name: 'Over mij' }).click()
    await expect(page.locator('.page-transition-cover')).toBeVisible()
    await expect(page.locator('h1')).toContainText('Altijd op zoek')
    await expect(page.locator('.page-transition-cover')).toHaveCount(0)
    await expect(page).toHaveURL(/over-mij\?demo=1/)
    await page.goBack()
    await expect(page.locator('h1')).toContainText('Verhalen die')
  }
})

// Scrollbeweging en overgang mogen bij reduced-motion geen verborgen of bewegende inhoud achterlaten.
test('filmbeeld en navigatie respecteren minder beweging', async ({ page }) => {
  const site = structuredClone(initialSite)
  site.settings.pageTransition = 'curtain'
  Object.assign(site.pages[0].sections[1], {
    videoStyle: 'project',
    scrollEffect: 'expand',
    animation: 'iris',
    fullBleed: true,
  })
  await page.addInitScript(
    (site) => localStorage.setItem('aidan:live', JSON.stringify({ site, revision: 1 })),
    site
  )
  await page.emulateMedia({ reducedMotion: 'reduce' })
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?demo=1')
  await page.locator('.film-frame').scrollIntoViewIfNeeded()
  await expect(page.locator('.film-frame')).toHaveCSS('clip-path', 'none')
  await expect(page.locator('.motion-iris')).toHaveCSS('transform', 'none')
  await expect(page.locator('.motion-iris')).toHaveCSS('opacity', '1')
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  await page.getByRole('button', { name: 'Menu +' }).click()
  await page.getByRole('link', { name: 'Over mij' }).click()
  await expect(page.locator('h1')).toContainText('Altijd op zoek')
  await expect(page.locator('.page-transition-cover')).toHaveCount(0)
})

// De schuifovergang gebruikt View Transitions, wisselt echt van pagina en ruimt zijn stijl op.
test('pagina schuift omhoog tussen pagina’s en respecteert minder beweging', async ({ page }) => {
  const site = structuredClone(initialSite)
  site.settings.pageTransition = 'push'
  site.settings.transitionDuration = 200
  await page.addInitScript((site) => {
    localStorage.setItem('aidan:live', JSON.stringify({ site, revision: 1 }))
    // Telt hoe vaak de browser een schuifovergang start.
    window.pushCount = 0
    const original = document.startViewTransition?.bind(document)
    if (original)
      document.startViewTransition = (update) => {
        window.pushCount += 1
        return original(update)
      }
  }, site)
  await page.goto('/?demo=1')
  await expect(page.locator('h1')).toBeVisible()
  await page.getByRole('link', { name: 'Over mij' }).click()
  await expect(page.locator('h1')).toContainText('Altijd op zoek')
  await expect(page).toHaveURL(/over-mij\?demo=1/)
  expect(await page.evaluate(() => window.pushCount)).toBe(1)
  await expect(page.locator('html')).not.toHaveClass(/vt-push/)
  expect(await page.evaluate(() => scrollY)).toBe(0)
  await page.goBack()
  await expect(page.locator('h1')).toContainText('Verhalen die')
  // Snel heen en weer klikken laat geen half afgemaakte overgang achter.
  await page.getByRole('link', { name: 'Over mij' }).click()
  await page.getByRole('link', { name: 'Werk' }).click()
  await expect(page.locator('h1')).toContainText('Verhalen die')
  await expect(page.locator('html')).not.toHaveClass(/vt-push/)
  await page.emulateMedia({ reducedMotion: 'reduce' })
  const before = await page.evaluate(() => window.pushCount)
  await page.getByRole('link', { name: 'Over mij' }).click()
  await expect(page.locator('h1')).toContainText('Altijd op zoek')
  expect(await page.evaluate(() => window.pushCount)).toBe(before)
})
