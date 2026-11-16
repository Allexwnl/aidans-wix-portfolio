/** Bedieningsuitbreiding — versie 1.0 | Laatst gewijzigd: 2026-11-04. Zichtbaarheid en werkruimte. */
import { test, expect } from '@playwright/test'

// Uitschakelen wist nooit de titel, tekst of foto-inhoud van het concept.
test('carouselonderdelen aan en uit blijven bewaard na publiceren', async ({ page }) => {
  await page.goto('/studio?demo=1')
  const canvas = page.frameLocator('iframe.canvas-frame')
  await expect(canvas.locator('h1')).toBeVisible()
  await page.getByRole('button', { name: 'Toevoegen', exact: true }).click()
  await page.getByRole('button', { name: /Fotocarousel Beelden/ }).click()
  await page.getByRole('textbox', { name: 'Titel', exact: true }).fill('Mijn beelden')
  await page
    .locator('textarea')
    .and(page.getByRole('textbox', { name: 'Tekst', exact: true }))
    .fill('Een verhaal achter de foto')
  await page.getByRole('checkbox', { name: 'Titel tonen', exact: true }).uncheck()
  await page.getByRole('checkbox', { name: 'Tekst tonen', exact: true }).uncheck()
  await page.getByRole('checkbox', { name: 'Fotobijschriften tonen' }).uncheck()
  await page.getByRole('checkbox', { name: 'Carouselknoppen tonen' }).uncheck()
  await expect(canvas.locator('.gallery-block h2')).toHaveCount(0)
  await expect(canvas.locator('.gallery-block figcaption')).toHaveCount(0)
  await expect(canvas.getByRole('button', { name: 'Volgende foto' })).toHaveCount(0)
  await expect(canvas.locator('.gallery-track img')).toHaveCount(2)
  await page.getByRole('checkbox', { name: 'Titel tonen', exact: true }).check()
  await expect(canvas.locator('.gallery-block h2')).toHaveText('Mijn beelden')
  await page.getByRole('checkbox', { name: 'Titel tonen', exact: true }).uncheck()
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click()
  await expect(page.locator('.toast')).toContainText('Lokaal gepubliceerd')
  await page.goto('/?demo=1')
  await expect(page.locator('.gallery-track img')).toHaveCount(2)
  await expect(page.locator('.gallery-block h2')).toHaveCount(0)
  await expect(page.getByText('Een verhaal achter de foto')).toHaveCount(0)
})

// Werkplekbreedtes horen niet bij publicatie, maar blijven lokaal bewaard.
test('zijpanelen slepen, inklappen en herstellen zonder ontwerpverlies', async ({ page }) => {
  await page.goto('/studio?demo=1')
  const canvas = page.frameLocator('iframe.canvas-frame')
  await canvas.locator('h1').fill('Mijn werkruimte')
  const handle = page.getByRole('separator', { name: 'Linkerpaneel breedte' })
  const bounds = await handle.boundingBox()
  await page.mouse.move(bounds.x + bounds.width / 2, bounds.y + 100)
  await page.mouse.down()
  await page.mouse.move(bounds.x + bounds.width / 2 + 70, bounds.y + 100, { steps: 8 })
  await page.mouse.up()
  await expect(handle).toHaveAttribute('aria-valuenow', '303')
  await page.getByRole('button', { name: 'Rechterpaneel inklappen' }).click()
  await expect(page.locator('.panel-right')).toHaveClass(/panel-collapsed/)
  await expect(canvas.locator('h1')).toHaveText('Mijn werkruimte')
  await page.getByRole('button', { name: 'Rechterpaneel uitklappen' }).click()
  await page.getByRole('separator', { name: 'Rechterpaneel breedte' }).press('ArrowLeft')
  await expect(page.getByRole('separator', { name: 'Rechterpaneel breedte' })).toHaveAttribute(
    'aria-valuenow',
    '290'
  )
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click()
  await expect(page.locator('.toast')).toContainText('Lokaal gepubliceerd')
  await page.reload()
  await expect(handle).toHaveAttribute('aria-valuenow', '303')
  await expect(canvas.locator('h1')).toHaveText('Mijn werkruimte')
})

// Canvasgrepen slaan één verplaatsing op en houden mobiele offsets onafhankelijk.
test('canvasverplaatsing via toetsenbord en undo', async ({ page }) => {
  await page.goto('/studio?demo=1')
  const canvas = page.frameLocator('iframe.canvas-frame')
  const handle = canvas.getByRole('button', { name: 'Bouwsteen verslepen', exact: true })
  await handle.press('Shift+ArrowRight')
  await expect(page.getByRole('spinbutton', { name: 'Verschuif X (px)' })).toHaveValue('10')
  await page.getByRole('button', { name: 'Ongedaan maken', exact: true }).click()
  await expect(page.getByRole('spinbutton', { name: 'Verschuif X (px)' })).toHaveValue('0')
  await page.getByRole('button', { name: 'Mobiel voorbeeld', exact: true }).click()
  await handle.press('Shift+ArrowDown')
  await expect(page.getByRole('spinbutton', { name: 'Verschuif Y (px)' })).toHaveValue('10')
  await page.getByRole('button', { name: 'Desktopvoorbeeld', exact: true }).click()
  await expect(page.getByRole('spinbutton', { name: 'Verschuif Y (px)' })).toHaveValue('0')
})
