/** Lokale proefopslag — versie 1.0 | Laatst gewijzigd: 2026-10-29. Web Locks voorkomen gelijktijdige tabwrites. */
// Houdt de lokale demonstratie gescheiden van echte Firebase-data.
export async function saveLocalDraft(payload, expectedRevision) {
  // Deze kritieke sectie bevat geen await tussen revisielezen en schrijven.
  const write = () => {
    const current = JSON.parse(localStorage.getItem('aidan:draft') || 'null')
    if ((current?.revision || 0) !== expectedRevision)
      throw new Error(
        'Een ander tabblad heeft een nieuwere versie opgeslagen. Exporteer je wijzigingen en herlaad.'
      )
    localStorage.setItem('aidan:draft', JSON.stringify(payload))
  }
  if (navigator.locks) return navigator.locks.request('aidan:draft-save', write)
  return write()
}
