/** Navigatie en overgangen — versie 1.0 | Laatst gewijzigd: 2026-11-04. Alle routes en varianten. */
import { test, expect } from '@playwright/test'
import { initialSite } from '../../src/data/initialSite.js'

// Alle stijlen gebruiken dezelfde werkende links, met een bereikbaar mobiel menu.
test('navbarvarianten werken op desktop en mobiel', async ({ page }) => {
  await page.goto('/studio?demo=1')
  const canvas = page.frameLocator('iframe.canvas-frame')
  await expect(canvas.locator('h1')).toBeVisible()
  await page.getByRole('button', { name: 'Navigatie', exact: true }).click()
  for (const variant of ['classic', 'centered', 'floating', 'compact']) {
    await page.getByRole('combobox', { name: 'Navbarvariant' }).selectOption(variant)
    await expect(canvas.locator('.site-header')).toHaveClass(new RegExp(`navbar-${variant}`))
  }
  await canvas.getByRole('button', { name: 'Menu +' }).click()
  await expect(canvas.getByRole('link', { name: 'Over mij' })).toBeVisible()
  await canvas.getByRole('button', { name: 'Sluiten −' }).press('Escape')
  await expect(canvas.getByRole('navigation')).not.toBeVisible()
  await page.getByRole('button', { name: 'Mobiel voorbeeld', exact: true }).click()
  await canvas.getByRole('button', { name: 'Menu +' }).click()
  await canvas.getByRole('link', { name: 'Over mij' }).click()
  await expect(canvas.locator('h1')).toContainText('Altijd op zoek')
  expect(
    await canvas.locator('body').evaluate((element) => element.scrollWidth)
  ).toBeLessThanOrEqual(390)
})

// Terug/vooruit loopt nu door dezelfde overgang als een klik; snel navigeren eindigt op de laatste pagina.
test('terug en snelle navigatie laten geen vastgelopen overgang achter', async ({ page }) => {
  const site = structuredClone(initialSite)
  site.settings.pageTransition = 'slide-left'
  site.settings.transitionDuration = 250
  await page.addInitScript(
    (site) => localStorage.setItem('aidan:live', JSON.stringify({ site, revision: 1 })),
    site
  )
  await page.goto('/?demo=1')
  await page.getByRole('link', { name: 'Over mij' }).click()
  await expect(page.locator('h1')).toContainText('Altijd op zoek')
  await expect(page.locator('.page-transition-cover')).toHaveCount(0)
  await page.goBack()
  await expect(page.locator('.page-transition-cover')).toHaveCount(1)
  await expect(page.locator('h1')).toContainText('Verhalen die')
  await expect(page.locator('.page-transition-cover')).toHaveCount(0)
  await page.getByRole('link', { name: 'Over mij' }).click()
  await page.getByRole('link', { name: 'Werk', exact: false }).click()
  await expect(page.locator('h1')).toContainText('Verhalen die')
  await expect(page.locator('.page-transition-cover')).toHaveCount(0)
  await expect(page).toHaveURL(/\/\?demo=1$/)
})
