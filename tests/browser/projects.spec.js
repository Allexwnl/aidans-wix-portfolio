/** Projectflow — versie 1.0 | Laatst gewijzigd: 2026-10-29. Van raster naar een eigen filmische pagina. */
import { test, expect } from '@playwright/test'

// Maakt een echte projectpagina en controleert de gekoppelde kaart in het canvasvoorbeeld.
test('een project krijgt een eigen bewerkbare detailpagina', async ({ page }) => {
  await page.goto('/studio?demo=1')
  const canvas = page.frameLocator('iframe.canvas-frame')
  await expect(canvas.locator('h1')).toBeVisible()
  await page.getByRole('button', { name: 'Geselecteerd werk', exact: false }).click()
  await page.locator('.item-editor summary').first().click()
  await page.getByRole('button', { name: 'Filmische detailpagina maken' }).first().click()
  await expect(page.locator('.toolbar-page')).toContainText('Een nieuw perspectief')
  await expect(canvas.locator('.film-caption h2')).toHaveText('Een nieuw perspectief')
  await expect(canvas.locator('.gallery-block')).toHaveCount(1)
  await page.locator('.pages-list').getByRole('button', { name: /Home/ }).click()
  await page.getByRole('button', { name: 'Voorbeeld', exact: true }).click()
  await canvas.getByRole('link', { name: 'Open Een nieuw perspectief' }).click()
  await expect(page.locator('.toolbar-page')).toContainText('Een nieuw perspectief')
  await expect(canvas.locator('.film-caption h2')).toHaveText('Een nieuw perspectief')
})
