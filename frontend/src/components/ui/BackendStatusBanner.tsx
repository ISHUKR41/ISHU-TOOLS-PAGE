import { useBackendHealth } from '../../hooks/useBackendHealth'

/**
 * BackendStatusBanner — a slim, non-blocking ribbon that surfaces the API's
 * cold-start state to the user. Hidden during the steady-state ('ok' or
 * 'unknown'); only appears when the backend is genuinely unreachable.
 *
 * Designed to be globally mounted once (in App.tsx), so every tool page
 * benefits without any per-tool wiring.
 */
export default function BackendStatusBanner() {
  const { status } = useBackendHealth()

  if (status === 'ok' || status === 'unknown') return null

  const isWaking = status === 'waking'

  return (
    <div
      role='status'
      aria-live='polite'
      className='backend-status-banner'
      data-state={status}
    >
      <span className='backend-status-dot' aria-hidden='true' />
      <span className='backend-status-text'>
        {isWaking
          ? 'Server is waking up — first action may take ~20 seconds. Hang tight…'
          : 'The server is taking longer than usual to respond. Tools will recover automatically.'}
      </span>
    </div>
  )
}
