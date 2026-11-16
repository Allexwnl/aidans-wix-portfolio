/** E-mailauthenticatie — versie 1.1 | Laatst gewijzigd: 2026-11-16. SDK-integratie met nagebootste Firebase-antwoorden. */
// Buffer komt expliciet uit Node, zodat de lintregels voor browsercode blijven gelden.
import { Buffer } from 'node:buffer'
import { test, expect } from '@playwright/test'

// Ongeldige gegevens tonen dezelfde melding; wachtwoorden worden na een poging geleegd.
test('wachtwoordlogin behandelt fouten en kan opnieuw proberen', async ({ page }) => {
  const requests = []
  await page.route('https://identitytoolkit.googleapis.com/**', async (route) => {
    if (route.request().url().includes('accounts:signInWithPassword')) {
      requests.push(route.request().postDataJSON())
      return route.fulfill({
        status: 400,
        json: { error: { code: 400, message: 'INVALID_LOGIN_CREDENTIALS' } },
      })
    }
    return route.fulfill({ json: {} })
  })
  await page.goto('/studio')
  await page.getByLabel('E-mailadres', { exact: true }).fill('aidan@example.com')
  await page.getByLabel('Wachtwoord', { exact: true }).fill(' test-wachtwoord ')
  await page.getByRole('button', { name: 'Inloggen →', exact: true }).click()
  await expect(page.getByRole('alert')).toHaveText('Controleer je e-mailadres en wachtwoord.')
  await expect(page.getByLabel('Wachtwoord', { exact: true })).toHaveValue('')
  await expect(page.getByRole('button', { name: 'Inloggen →', exact: true })).toBeEnabled()
  expect(requests[0].email).toBe('aidan@example.com')
  expect(requests[0].password).toBe(' test-wachtwoord ')
  expect(await page.evaluate(() => JSON.stringify(localStorage))).not.toContain('test-wachtwoord')
  await expect(page.getByRole('button', { name: 'Inloggen met Google' })).toHaveCount(0)
})

// Een geslaagde login bereikt de cloudwerkruimte, zonder een lokale proef te openen.
test('e-mailaccount opent de cloudwerkruimte na SDK-login', async ({ page }) => {
  const now = Math.floor(Date.now() / 1000)
  const token = [
    'header',
    Buffer.from(
      JSON.stringify({ sub: 'test-editor-uid', iat: now, exp: now + 3600, auth_time: now })
    ).toString('base64url'),
    'signature',
  ].join('.')
  await page.route('https://identitytoolkit.googleapis.com/**', (route) =>
    route.fulfill({
      json: route.request().url().includes('accounts:signInWithPassword')
        ? {
            localId: 'test-editor-uid',
            email: 'aidan@example.com',
            idToken: token,
            refreshToken: 'test-refresh',
            expiresIn: '3600',
            registered: true,
          }
        : {
            users: [
              {
                localId: 'test-editor-uid',
                email: 'aidan@example.com',
                emailVerified: true,
                providerUserInfo: [
                  {
                    providerId: 'password',
                    email: 'aidan@example.com',
                    federatedId: 'aidan@example.com',
                  },
                ],
              },
            ],
          },
    })
  )
  // De test bewijst aanmelden, niet toegang tot een echte Firestore-database.
  await page.route('https://firestore.googleapis.com/**', (route) => route.abort())
  await page.goto('/studio')
  await page.getByLabel('E-mailadres', { exact: true }).fill('aidan@example.com')
  await page.getByLabel('Wachtwoord', { exact: true }).fill('test-wachtwoord')
  await page.getByRole('button', { name: 'Inloggen →', exact: true }).click()
  await expect(page.locator('.account-reference')).toContainText('test-editor-uid')
  await expect(page.getByRole('form', { name: 'Inloggen' })).toHaveCount(0)
  await expect(page.locator('.studio')).toHaveCount(0)
})
