/** App — versie 2.0 | Laatst gewijzigd: 2026-11-04. Stelt de bouwer samen. */
import { useEffect, useState } from 'react'
import { Builder } from './features/builder/Builder.jsx'
import { PublicSite } from './features/renderer/PublicSite.jsx'
import { firebaseReady, localEnvironment, watchUser, logout } from './services/firebase.js'
import { LoginScreen } from './features/auth/LoginScreen.jsx'
import './App.css'

// Scheidt publieke pagina's van het dashboard en de expliciete lokale proefmodus.
export default function App() {
  const [account, setAccount] = useState({ loading: firebaseReady, user: null })
  useEffect(
    () => (firebaseReady ? watchUser((user) => setAccount({ loading: false, user })) : undefined),
    []
  )
  // Een incomplete live configuratie mag nooit stilletjes een lokale editor openen.
  if (!firebaseReady && !localEnvironment)
    return (
      <main className="entry">
        <h1>Deze website wordt aangesloten.</h1>
        <p>De online opslag is nog niet ingesteld. Neem contact op met de beheerder.</p>
      </main>
    )
  if (!location.pathname.startsWith('/studio')) return <PublicSite />
  if (account.loading)
    return (
      <main className="entry">
        <span className="brand-mark">a.</span>
        <p>Studio openen…</p>
      </main>
    )
  if (firebaseReady && !account.user) return <LoginScreen />
  return <Builder account={account.user} onLogout={logout} />
}
