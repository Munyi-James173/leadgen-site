import { useCallback } from 'react'

const SESSION_KEY = 'apex_session_id'

function getSessionId() {
  let sid = sessionStorage.getItem(SESSION_KEY)
  if (!sid) {
    sid = `sess_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    sessionStorage.setItem(SESSION_KEY, sid)
  }
  return sid
}

export function useAnalytics() {
  const track = useCallback(async (eventType, eventData = {}) => {
    // Wait until the server is likely ready (avoids ECONNRESET on first render)
    await new Promise((r) => setTimeout(r, 300))
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: eventType,
          event_data: eventData,
          session_id: getSessionId(),
        }),
      })
    } catch {
      // Fail silently — analytics must never break UX
    }
  }, [])

  return { track }
}
