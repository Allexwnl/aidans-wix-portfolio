/** Browsertests — versie 1.1 | Laatst gewijzigd: 2026-11-16. Lokale proef zonder accountmutaties. */
import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/browser',
  use: {
    baseURL: 'http://127.0.0.1:5180',
    viewport: { width: 1440, height: 1000 },
    headless: true,
  },
  workers: 1,
  reporter: 'list',
  webServer: {
    command: 'node node_modules/vite/bin/vite.js --host 127.0.0.1 --port 5180 --strictPort',
    url: 'http://127.0.0.1:5180',
    reuseExistingServer: true,
    timeout: 30000,
    // Nepwaarden: de logintests bootsen Firebase na en mogen niet afhangen van .env.local.
    env: {
      VITE_FIREBASE_API_KEY: 'test-api-key',
      VITE_FIREBASE_AUTH_DOMAIN: 'test-project.firebaseapp.com',
      VITE_FIREBASE_PROJECT_ID: 'test-project',
      VITE_FIREBASE_APP_ID: 'test-app-id',
    },
  },
})
