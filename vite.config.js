/** Vite — versie 1.0 | Laatst gewijzigd: 2026-10-29. React en gescheiden Firebase-bundel. */
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // FFmpeg gebruikt een eigen moduleworker die niet vooraf gebundeld moet worden.
  optimizeDeps: { exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'] },
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [{ name: 'firebase', test: /node_modules\/(?:@firebase|firebase)\// }],
        },
      },
    },
  },
})
