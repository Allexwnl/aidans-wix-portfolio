/** Browsertests — versie 1.0 | Laatst gewijzigd: 2026-10-29. Lokale proef zonder accountmutaties. */
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
  },
})
