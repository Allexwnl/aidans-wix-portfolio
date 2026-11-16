/** Startpunt — versie 1.0 | Laatst gewijzigd: 2026-10-29. Koppelt React aan de HTML-pagina. */
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
