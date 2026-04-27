import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
  retryCount: number
  isRetrying: boolean
}

const MAX_AUTO_RETRIES = 2
const RETRY_DELAY_MS = 2000

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  private retryTimer: ReturnType<typeof setTimeout> | null = null

  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    // Log to console in development only
    if (import.meta.env.DEV) {
      console.error('[ISHU TOOLS] Error caught by boundary:', error, errorInfo)
    }

    // Auto-retry up to MAX_AUTO_RETRIES times
    if (this.state.retryCount < MAX_AUTO_RETRIES) {
      this.setState({ isRetrying: true })
      this.retryTimer = setTimeout(() => {
        this.setState((prev) => ({
          hasError: false,
          error: null,
          errorInfo: null,
          retryCount: prev.retryCount + 1,
          isRetrying: false,
        }))
      }, RETRY_DELAY_MS)
    }
  }

  componentWillUnmount() {
    if (this.retryTimer) {
      clearTimeout(this.retryTimer)
    }
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      retryCount: 0,
      isRetrying: false,
    })
  }

  handleReload = () => {
    window.location.reload()
  }

  handleGoHome = () => {
    window.location.href = '/'
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      // Show retrying state
      if (this.state.isRetrying) {
        return (
          <div className='error-boundary-container'>
            <div className='error-boundary-card'>
              <div className='error-boundary-icon error-boundary-icon-retrying'>
                <svg width='32' height='32' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round' className='error-boundary-spinner'>
                  <path d='M21 12a9 9 0 1 1-6.219-8.56' />
                </svg>
              </div>
              <h2 className='error-boundary-title'>Recovering…</h2>
              <p className='error-boundary-message'>
                Something went wrong. Retrying automatically…
                (Attempt {this.state.retryCount + 1} of {MAX_AUTO_RETRIES})
              </p>
            </div>
          </div>
        )
      }

      // All auto-retries exhausted — show manual recovery UI
      return (
        <div className='error-boundary-container'>
          <div className='error-boundary-card'>
            <div className='error-boundary-icon'>
              <svg width='48' height='48' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.5' strokeLinecap='round' strokeLinejoin='round' style={{ color: 'var(--color-warning, #f59e0b)' }}>
                <path d='m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z' />
                <line x1='12' y1='9' x2='12' y2='13' />
                <line x1='12' y1='17' x2='12.01' y2='17' />
              </svg>
            </div>
            <h2 className='error-boundary-title'>Something went wrong</h2>
            <p className='error-boundary-message'>
              This tool ran into an unexpected issue. This is usually temporary.
            </p>
            <p className='error-boundary-hint'>
              Try clicking "Reset Tool" below. If the problem continues, reload the page or visit a different tool.
            </p>
            <div className='error-boundary-actions'>
              <button
                className='error-boundary-btn error-boundary-btn-primary'
                onClick={this.handleRetry}
              >
                <svg width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                  <path d='M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' />
                  <path d='M3 3v5h5' />
                  <path d='M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16' />
                  <path d='M16 16h5v5' />
                </svg>
                Reset Tool
              </button>
              <button
                className='error-boundary-btn error-boundary-btn-secondary'
                onClick={this.handleReload}
              >
                Reload Page
              </button>
              <button
                className='error-boundary-btn error-boundary-btn-ghost'
                onClick={this.handleGoHome}
              >
                Go Home
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details className='error-boundary-details'>
                <summary>Technical Details (dev only)</summary>
                <pre>{this.state.error.stack}</pre>
                {this.state.errorInfo && (
                  <pre>{this.state.errorInfo.componentStack}</pre>
                )}
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
