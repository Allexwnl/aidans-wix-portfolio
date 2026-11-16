/** Inloggen — versie 1.0 | Laatst gewijzigd: 2026-11-04. Bestaande Firebase-accounts met wachtwoord. */
import { useState } from 'react'
import { localEnvironment, login } from '../../services/firebase.js'

// Geeft begrijpelijke fouten zonder te onthullen welke e-mailadressen geregistreerd zijn.
function loginMessage(code) {
  if (
    [
      'auth/invalid-credential',
      'auth/invalid-login-credentials',
      'auth/user-not-found',
      'auth/wrong-password',
      'auth/invalid-email',
    ].includes(code)
  )
    return 'Controleer je e-mailadres en wachtwoord.'
  if (code === 'auth/too-many-requests')
    return 'Te veel inlogpogingen. Wacht even en probeer opnieuw.'
  if (code === 'auth/network-request-failed')
    return 'Geen verbinding. Controleer je internet en probeer opnieuw.'
  if (['auth/operation-not-allowed', 'auth/configuration-not-found'].includes(code))
    return 'Inloggen met e-mail en wachtwoord is nog niet ingeschakeld voor deze website.'
  if (code === 'auth/user-disabled')
    return 'Dit account is uitgeschakeld. Neem contact op met de beheerder.'
  return 'Inloggen is niet gelukt. Probeer het opnieuw.'
}

// Het wachtwoord blijft uitsluitend tijdelijk in het formulier en gaat rechtstreeks naar Firebase.
export function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  return (
    <main className="entry">
      <span className="eyebrow">AIDAN / STUDIO</span>
      <h1>
        Ruimte voor
        <br />
        jouw verhalen.
      </h1>
      <p>Log in met je e-mailadres en wachtwoord om je website te bewerken.</p>
      <form
        className="login-form"
        aria-label="Inloggen"
        aria-busy={busy}
        onSubmit={async (event) => {
          event.preventDefault()
          if (busy) return
          setBusy(true)
          setError('')
          try {
            await login(email.trim(), password)
          } catch (reason) {
            setError(loginMessage(reason.code))
          } finally {
            setPassword('')
            setBusy(false)
          }
        }}
      >
        <label className="field" htmlFor="login-email">
          E-mailadres
        </label>
        <input
          id="login-email"
          type="email"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          required
          disabled={busy}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
        />
        <label className="field" htmlFor="login-password">
          Wachtwoord
        </label>
        <input
          id="login-password"
          type="password"
          autoComplete="current-password"
          required
          disabled={busy}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          aria-describedby={error ? 'login-error' : undefined}
        />
        {error && (
          <p id="login-error" role="alert">
            {error}
          </p>
        )}
        <button className="primary" type="submit" disabled={busy}>
          {busy ? 'Bezig met inloggen…' : 'Inloggen →'}
        </button>
      </form>
      {localEnvironment && <a href="/studio?demo=1">Lokale proef openen zonder cloud →</a>}
    </main>
  )
}
