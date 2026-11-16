/** Firebase — versie 2.0 | Laatst gewijzigd: 2026-11-04. Publieke clientconfiguratie en beheerlogin. */
import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Zonder projectconfiguratie draait alleen de herkenbare lokale proefmodus.
const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}
export const localEnvironment = ['localhost', '127.0.0.1', '[::1]'].includes(location.hostname)
export const localDemo =
  localEnvironment && new URLSearchParams(location.search).get('demo') === '1'
export const firebaseReady = !localDemo && Object.values(config).every(Boolean)
const app = firebaseReady ? initializeApp(config) : null
export const auth = app ? getAuth(app) : null
export const db = app ? getFirestore(app) : null
export const siteId = 'portfolio'

// Luistert naar de loginstatus; Firestore Rules bepalen de werkelijke rechten.
export function watchUser(callback) {
  return onAuthStateChanged(auth, callback)
}
// Gebruikt het bestaande e-mail/wachtwoord-account; alleen Firebase controleert het wachtwoord.
export function login(email, password) {
  return signInWithEmailAndPassword(auth, email, password)
}
// Beëindigt de beheersessie.
export function logout() {
  return signOut(auth)
}
