/** Uitgebreide editor — versie 1.0 | Laatst gewijzigd: 2026-10-29. Echt canvas, opslag en fonts. */
import { test, expect } from '@playwright/test'

// Dezelfde geneste inhoud blijft bewerkbaar, dupliceerbaar en publiceerbaar.
test('containers nesten, verplaatsen en publiceren', async ({ page }) => {
  await page.goto('/studio?demo=1')
  const canvas = page.frameLocator('iframe.canvas-frame')
  await expect(canvas.locator('h1')).toBeVisible()
  await page.getByRole('button', { name: 'Toevoegen', exact: true }).click()
  await page.getByRole('button', { name: 'Container Geneste rijen en rasters' }).click()
  await page.getByRole('textbox', { name: 'Naam in lagen' }).fill('Buitenste container')
  await page.getByRole('button', { name: 'Bouwsteen in container toevoegen' }).click()
  await page.getByRole('button', { name: 'Container Geneste rijen en rasters' }).click()
  await page.getByRole('textbox', { name: 'Naam in lagen' }).fill('Binnenste container')
  await page.getByRole('button', { name: 'Introductie', exact: true }).click()
  await page
    .getByRole('combobox', { name: 'Plaatsen in', exact: true })
    .selectOption({ label: 'Binnenste container' })
  await expect(canvas.locator('.container-block .container-block h1')).toBeVisible()
  await canvas.locator('h1').fill('Diep genest verhaal')
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Lokaal gepubliceerd')
  await page.reload()
  await expect(canvas.locator('.container-block .container-block h1')).toHaveText(
    'Diep genest verhaal'
  )
  await page
    .getByRole('button', { name: /Buitenste container/, exact: false })
    .first()
    .click()
  await page.getByRole('button', { name: 'Dupliceren', exact: true }).click()
  await expect(canvas.locator('h1')).toHaveCount(2)
  await page.getByRole('button', { name: 'Mobiel voorbeeld', exact: true }).click()
  expect(await canvas.locator('body').evaluate((body) => body.scrollWidth)).toBeLessThanOrEqual(390)
  await page.goto('/?demo=1')
  await expect(page.locator('.container-block .container-block h1')).toHaveText(
    'Diep genest verhaal'
  )
})

// Woordopmaak en mobiele tekstgrootte reizen door concept en live release.
test('woordopmaak, tekstlink en mobiele typografie blijven bewaard', async ({ page }) => {
  await page.goto('/studio?demo=1')
  const canvas = page.frameLocator('iframe.canvas-frame')
  const title = canvas.locator('h1')
  await title.fill('Een eigen verhaal')
  await title.evaluate((element) => {
    element.focus()
    const selection = element.ownerDocument.getSelection()
    const range = element.ownerDocument.createRange()
    range.setStart(element.firstChild, 4)
    range.setEnd(element.firstChild, 9)
    selection.removeAllRanges()
    selection.addRange(range)
  })
  await canvas.getByRole('button', { name: 'Vet', exact: true }).click()
  await expect(title.locator('b, strong')).toHaveText('eigen')
  await canvas.getByRole('textbox', { name: 'Tekstlink' }).fill('https://example.com/')
  await canvas.getByRole('button', { name: 'Link', exact: true }).click()
  await expect(title.locator('a')).toHaveAttribute('href', 'https://example.com/')
  await page.getByRole('spinbutton', { name: 'Grootte (px)', exact: true }).fill('76')
  await expect(title).toHaveCSS('font-size', '76px')
  await page.getByRole('button', { name: 'Mobiel voorbeeld', exact: true }).click()
  await page.getByRole('spinbutton', { name: 'Grootte (px)', exact: true }).fill('34')
  await expect(title).toHaveCSS('font-size', '34px')
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Lokaal gepubliceerd')
  await page.reload()
  await expect(title.locator('b, strong')).toHaveText('eigen')
  await page.goto('/?demo=1')
  await expect(page.locator('h1 a')).toHaveAttribute('href', 'https://example.com/')
  await expect(page.locator('h1')).toHaveCSS('font-size', '76px')
  await page.setViewportSize({ width: 390, height: 844 })
  await expect(page.locator('h1')).toHaveCSS('font-size', '34px')
})

// Een echt fontbestand wordt gelezen, opgeslagen en opnieuw in het juiste document geregistreerd.
test('eigen font uploaden en gebruiken na herladen en publiceren', async ({ page }) => {
  await page.goto('/studio?demo=1')
  const canvas = page.frameLocator('iframe.canvas-frame')
  await expect(canvas.locator('h1')).toBeVisible()
  await page.getByRole('button', { name: 'Vormgeving', exact: true }).first().click()
  await page
    .getByLabel('Font uploaden', { exact: true })
    .setInputFiles('tests/fixtures/ABeeZee-Regular.ttf')
  await expect(page.getByRole('status')).toContainText('ABeeZee-Regular is beschikbaar')
  await page.getByRole('combobox', { name: 'Lettertype', exact: true }).selectOption({ label: 'ABeeZee-Regular' })
  await expect
    .poll(() =>
      canvas
        .locator('body')
        .evaluate((element) => [...element.ownerDocument.fonts].map((font) => font.status))
    )
    .toContain('loaded')
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click()
  await expect(page.locator('.toast')).toContainText('Lokaal gepubliceerd')
  await page.reload()
  await expect(canvas.locator('h1')).toHaveCSS('font-family', /aidan-font-/)
  await page.goto('/?demo=1')
  await expect
    .poll(() =>
      page.evaluate(() =>
        [...document.fonts].some(
          (font) => font.family.startsWith('aidan-font-') && font.status === 'loaded'
        )
      )
    )
    .toBe(true)
})
