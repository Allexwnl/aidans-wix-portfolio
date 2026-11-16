/** Worker-authenticatie — versie 1.1 | Laatst gewijzigd: 2026-11-16. Verifieert Firebase ID-tokens. */
import { createRemoteJWKSet, jwtVerify } from 'jose'

// Google publiceert roterende verificatiesleutels; jose controleert handtekening, issuer en audience.
const keys = createRemoteJWKSet(
  new URL(
    'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
  )
)

// ADMIN_UID bevat één of meer Firebase-UID's, gescheiden door komma's; alleen exacte overeenkomsten tellen.
export function isAdminUid(uid, env) {
  if (typeof uid !== 'string' || !uid || uid.length > 128) return false
  return (env.ADMIN_UID || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .includes(uid)
}

// Alleen geconfigureerde beheerders kunnen de serverzijdige GitHub-koppeling gebruiken.
export async function authorize(request, env) {
  const token = request.headers.get('Authorization')?.match(/^Bearer (.+)$/)?.[1]
  if (!token || !env.FIREBASE_PROJECT_ID || !env.ADMIN_UID)
    throw new Error('Geen geldige beheersessie.')
  const { payload } = await jwtVerify(token, keys, {
    audience: env.FIREBASE_PROJECT_ID,
    issuer: `https://securetoken.google.com/${env.FIREBASE_PROJECT_ID}`,
    algorithms: ['RS256'],
  })
  if (!isAdminUid(payload.sub, env)) throw new Error('Geen beheertoegang.')
  return payload.sub
}
