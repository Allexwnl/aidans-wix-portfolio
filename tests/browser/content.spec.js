/** Inhoud en links — versie 1.0 | Laatst gewijzigd: 2026-11-16. Menulinks, footer, afbeeldingen, galerij en tablet. */
import { test, expect } from '@playwright/test'
import { initialSite } from '../../src/data/initialSite.js'

// Bouwt een live site met alle nieuwe instellingen en opent de opgegeven pagina als bezoeker.
async function openSite(page, path = '/?demo=1', width = 1440) {
  const site = structuredClone(initialSite)
  site.navigation.push(
    {
      id: 'nav-contact',
      label: 'Contact',
      kind: 'section',
      pageId: 'home',
      sectionId: 'contact',
      children: [],
    },
    {
      id: 'nav-extern',
      label: 'Instagram',
      kind: 'url',
      url: 'https://example.com/aidan',
      children: [],
    }
  )
  site.settings.footerConfig = {
    showYear: false,
    background: '#101010',
    color: '#f5f5f5',
    links: [{ id: 'foot-about', label: 'Over mij footer', kind: 'page', pageId: 'about' }],
  }
  Object.assign(site.pages[1].sections[1], {
    animation: 'none',
    imageSettings: {
      alt: 'Aidan achter de camera',
      ratio: '1/1',
      focusX: 20,
      focusY: 80,
      label: 'raw',
    },
  })
  site.pages[1].sections.push({
    id: 'fotos',
    type: 'gallery',
    label: 'Fotogalerij',
    title: 'Foto’s',
    animation: 'none',
    galleryMode: 'grid',
    galleryColumns: 3,
    mobile: { galleryColumns: 2 },
    items: [
      { id: 'f1', title: 'Kust', image: '/images/coast.jpg', imageSettings: { label: 'edited' } },
      { id: 'f2', title: 'Bos', image: '/images/forest.jpg' },
      { id: 'f3', title: 'Gebouw', image: '/images/building.jpg' },
    ],
  })
  await page.addInitScript(
    (site) => localStorage.setItem('aidan:live', JSON.stringify({ site, revision: 1 })),
    site
  )
  await page.setViewportSize({ width, height: 900 })
  await page.goto(path)
  await expect(page.locator('h1')).toBeVisible()
}

// Een sectielink wisselt van pagina en brengt de gekozen bouwsteen in beeld; extern opent apart.
test('menulinks naar sectie en externe URL werken voor bezoekers', async ({ page }) => {
  await openSite(page, '/over-mij?demo=1')
  const extern = page.getByRole('link', { name: 'Instagram' })
  await expect(extern).toHaveAttribute('href', 'https://example.com/aidan')
  await expect(extern).toHaveAttribute('target', '_blank')
  await expect(extern).toHaveAttribute('rel', 'noreferrer')
  await page.getByRole('link', { name: 'Contact', exact: false }).first().click()
  await expect(page).toHaveURL(/\/\?demo=1/)
  await expect(page.locator('[data-section-id="contact"]')).toBeInViewport()
  expect(await page.evaluate(() => scrollY)).toBeGreaterThan(200)
})

// De footer volgt de instellingen: eigen kleuren, links en een verborgen jaartal.
test('footer toont ingestelde links en kleuren', async ({ page }) => {
  await openSite(page)
  const footer = page.locator('.site-footer')
  await expect(footer).toHaveCSS('background-color', 'rgb(16, 16, 16)')
  await expect(footer).not.toContainText('©')
  await footer.getByRole('link', { name: 'Over mij footer' }).click()
  await expect(page.locator('h1')).toContainText('Altijd op zoek')
  await expect(page).toHaveURL(/over-mij\?demo=1/)
})

// Alttekst, uitsnede, focuspunt en label komen uit de instellingen; het raster past op mobiel.
test('afbeeldingsinstellingen en galerijraster op desktop en mobiel', async ({ page }) => {
  await openSite(page, '/over-mij?demo=1')
  const photo = page.locator('.image-block img')
  await expect(photo).toHaveAttribute('alt', 'Aidan achter de camera')
  await expect(photo).toHaveCSS('object-position', '20% 80%')
  await expect(photo).toHaveCSS('aspect-ratio', '1 / 1')
  await expect(page.locator('.image-block .photo-label')).toHaveText('Onbewerkt')
  const track = page.locator('.gallery-track')
  await expect(track).toHaveClass(/gallery-grid/)
  await expect(track.locator('.photo-label')).toHaveText('Bewerkt')
  const columns = () =>
    track.evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length)
  expect(await columns()).toBe(3)
  await page.setViewportSize({ width: 390, height: 844 })
  expect(await columns()).toBe(2)
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(390)
})

// De editor maakt een externe menulink, een footerlink en toont het tabletvoorbeeld op 820 px.
test('editor: linkbestemming, footerlink en tabletvoorbeeld', async ({ page }) => {
  await page.goto('/studio?demo=1')
  const canvas = page.frameLocator('iframe.canvas-frame')
  await expect(canvas.locator('h1')).toBeVisible()
  await page.getByRole('button', { name: 'Navigatie', exact: true }).click()
  await page.getByRole('button', { name: 'Menulink toevoegen' }).click()
  await page.getByLabel('Menulink soort').last().selectOption('url')
  await page.getByLabel('Menulink adres').fill('javascript:alert(1)')
  await expect(page.getByText('Gebruik een https-, mailto- of tel-adres.')).toBeVisible()
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click()
  await expect(page.getByRole('alert')).toContainText('https-, mailto- of tel-adres')
  await page.getByRole('button', { name: 'Melding sluiten' }).click()
  await page.getByLabel('Menulink adres').fill('https://example.com/werk')
  await expect(canvas.getByRole('link', { name: 'Nieuwe link' })).toHaveAttribute(
    'href',
    'https://example.com/werk'
  )
  await page.getByRole('button', { name: 'Footerlink toevoegen' }).click()
  await page.getByLabel('Footerlink label').fill('Naar contact')
  await page.getByLabel('Footerlink soort').selectOption('section')
  await page.getByLabel('Footerlink sectie').selectOption('contact')
  await expect(canvas.locator('.footer-links a')).toHaveAttribute('href', /#contact$/)
  await page.getByRole('button', { name: 'Publiceren', exact: true }).click()
  await expect(page.getByRole('status')).toContainText('Lokaal gepubliceerd')
  await page.getByRole('button', { name: 'Tabletvoorbeeld', exact: true }).click()
  await expect(page.locator('.canvas-surround')).toHaveClass(/device-tablet/)
  expect(await canvas.locator('body').evaluate(() => innerWidth)).toBe(820)
})
