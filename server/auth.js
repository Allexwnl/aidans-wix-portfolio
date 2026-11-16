/** Worker-authenticatie — versie 1.0 | Laatst gewijzigd: 2026-10-29. Verifieert Firebase ID-tokens. */
import { createRemoteJWKSet, jwtVerify } from 'jose'

// Google publiceert roterende verificatiesleutels; jose controleert handtekening, issuer en audience.
const keys = createRemoteJWKSet(
  new URL(
    'https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com'
  )
)

// Alleen de geconfigureerde beheerder kan de serverzijdige GitHub-koppeling gebruiken.
export async function authorize(request, env) {
  const token = request.headers.get('Authorization')?.match(/^Bearer (.+)$/)?.[1]
  if (!token || !env.FIREBASE_PROJECT_ID || !env.ADMIN_UID)
    throw new Error('Geen geldige beheersessie.')
  const { payload } = await jwtVerify(token, keys, {
    audience: env.FIREBASE_PROJECT_ID,
    issuer: `https://securetoken.google.com/${env.FIREBASE_PROJECT_ID}`,
    algorithms: ['RS256'],
  })
  if (payload.sub !== env.ADMIN_UID || !payload.sub || payload.sub.length > 128)
    throw new Error('Geen beheertoegang.')
  return payload.sub
}
