/** Studio-integratietests — versie 1.0 | Laatst gewijzigd: 2026-10-29. Bewerken, preview en publicatie. */
import { test, expect } from '@playwright/test'

// Een volledige lokale klantflow controleert dat concepten en live inhoud gescheiden blijven.
test('inline bewerken, mobiel, handmatige opslag en publiceren', async ({ page }) => {
  const errors = []
  page.on('pageerror', (error) => errors.push(error.message))
  await page.goto('/studio?demo=1')
  const canvas = page.frameLocator('iframe.canvas-frame')
  await expect(canvas.locator('h1')).toHaveText('Verhalen die\nje bijblijven.', {
    useInnerText: true,
  })
  await page.getByRole('button', { name: 'Instellingen', exact: true }).click()
  await page.getByRole('checkbox', { name: 'Autosave concept' }).uncheck()
  await canvas.locator('h1').fill('Mijn verhaal in beeld.')
  await expect(page.locator('.save-indicator')).toContainText('Niet opgeslagen')
  await page.getByRole('button', { name: 'Mobiel voorbeeld', exact: true }).click()
  await expect(page.locator('.canvas-surround')).toHaveClass(/device-mobile/)
  await expect
    .poll(() => canvas.locator('body').evaluate((element) => element.clientWidth))
    .toBeLessThanOrEqual(390)
  await page.getByRole('button', { name: 'Voorbeeld', exact: true }).click()
  await expect(canvas.locator('h1')).toHaveText('Mijn verhaal in beeld.')
  await expect(canvas.locator('[contenteditable]')).toHaveCount(0)
  await page.getByRole('button', { name: 'Bewerken', exact: true }).click()
  await page.getByRole('button', { name: 'Concept nu opslaan' }).click()
  await expect(page.getByRole('status')).toContainText('concept is opgeslagen')
  await page.reload()
  await expect(canvas.locator('h1')).toHaveText('Mijn verhaal in beeld.')
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Lokaal gepubliceerd')
  await page.goto('/?demo=1')
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Mijn verhaal in beeld.')
  expect(errors).toEqual([])
})

// Nieuwe pagina's en submenu's moeten vanuit de bouwer bereikbaar zijn.
test('pagina maken, bouwsteen toevoegen en submenu koppelen', async ({ page }) => {
  await page.goto('/studio?demo=1')
  await expect(page.frameLocator('iframe.canvas-frame').locator('h1')).toBeVisible()
  await page.getByRole('button', { name: 'Pagina toevoegen', exact: true }).click()
  await expect(
    page.frameLocator('iframe.canvas-frame').getByText('Een leeg canvas. Alle ruimte.')
  ).toBeVisible()
  await page.getByRole('button', { name: 'Toevoegen', exact: true }).click()
  await page.getByRole('button', { name: 'Grote introductie', exact: false }).click()
  await expect(page.frameLocator('iframe.canvas-frame').locator('h1')).toBeVisible()
  await page.getByRole('button', { name: 'Navigatie', exact: true }).click()
  await page.getByRole('button', { name: 'Submenu toevoegen' }).first().click()
  await expect(page.getByRole('textbox', { name: 'Submenu label' })).toBeVisible()
  await page.getByRole('textbox', { name: 'Submenu label' }).fill('Schoolprojecten')
  await page.frameLocator('iframe.canvas-frame').locator('summary').click()
  await expect(
    page.frameLocator('iframe.canvas-frame').getByRole('link', { name: 'Schoolprojecten' })
  ).toBeVisible()
})

// Een screenshot van de eerste herkenbare versie ondersteunt de visuele controle.
test('desktop en mobiele screenshot', async ({ page }) => {
  await page.goto('/studio?demo=1')
  await expect(page.frameLocator('iframe.canvas-frame').locator('h1')).toBeVisible()
  await page.waitForTimeout(1500)
  await page.screenshot({ path: 'test-results/studio-desktop.png', fullPage: true })
  await page.getByRole('button', { name: 'Mobiel voorbeeld', exact: true }).click()
  await page.waitForTimeout(500)
  await page.screenshot({ path: 'test-results/studio-mobile.png', fullPage: true })
})
