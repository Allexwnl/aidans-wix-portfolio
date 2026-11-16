/** Hersteltests — versie 1.0 | Laatst gewijzigd: 2026-10-29. Conflicten en ongeldige publicaties. */
import { test, expect } from '@playwright/test'

// Een achterhaald tabblad mag een nieuw opgeslagen concept niet overschrijven.
test('twee tabbladen detecteren een revisieconflict', async ({ page, context }) => {
  await page.goto('/studio?demo=1')
  await expect(page.frameLocator('iframe.canvas-frame').locator('h1')).toBeVisible()
  await page.getByRole('button', { name: 'Instellingen', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Autosave concept' }).uncheck()
  const second = await context.newPage()
  await second.goto('/studio?demo=1')
  await expect(second.frameLocator('iframe.canvas-frame').locator('h1')).toBeVisible()
  await second.getByRole('button', { name: 'Instellingen', exact: true }).click()
  await page.frameLocator('iframe.canvas-frame').locator('h1').fill('Versie uit tabblad één')
  await page.getByRole('button', { name: 'Concept nu opslaan' }).click()
  await expect(page.getByRole('status')).toContainText('concept is opgeslagen')
  await second.frameLocator('iframe.canvas-frame').locator('h1').fill('Versie uit tabblad twee')
  await second.getByRole('button', { name: 'Concept nu opslaan' }).click()
  await expect(second.getByRole('alert')).toContainText('ander tabblad')
  expect(
    await page.evaluate(
      () => JSON.parse(localStorage.getItem('aidan:draft')).site.pages[0].sections[0].title
    )
  ).toBe('Versie uit tabblad één')
})

// Ongeldige wijzigingen mogen een bestaande live versie niet beschadigen.
test('ongeldige pagina-URL houdt de vorige publicatie intact', async ({ page }) => {
  await page.goto('/studio?demo=1')
  await expect(page.frameLocator('iframe.canvas-frame').locator('h1')).toBeVisible()
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Lokaal gepubliceerd')
  await page.getByText('Pagina-instellingen', { exact: true }).click()
  await page.getByRole('textbox', { name: 'URL-pad' }).fill('ongeldig pad')
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('geldige URL')
  expect(
    await page.evaluate(() => JSON.parse(localStorage.getItem('aidan:live')).site.pages[0].slug)
  ).toBe('')
})

// De website behoudt een bruikbaar menu en blijft binnen een echte mobiele viewport.
test('mobiele bezoekersweergave heeft een werkend menu zonder overflow', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/?demo=1')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
  expect(
    await page.locator('.film-frame').evaluate((element) => element.getBoundingClientRect().right)
  ).toBeLessThanOrEqual(390)
  await page.getByRole('button', { name: 'Menu +' }).click()
  await expect(page.getByRole('navigation', { name: 'Hoofdnavigatie' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Over mij' })).toBeVisible()
  await page.getByRole('link', { name: 'Over mij' }).click()
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Altijd op zoek')
})
