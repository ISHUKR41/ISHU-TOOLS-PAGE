import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ errorInfo })
    // Log to console in development
    console.error('[ISHU TOOLS] Error caught by boundary:', error, errorInfo)
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
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

      return (
        <div className='error-boundary-container'>
          <div className='error-boundary-card'>
            <div className='error-boundary-icon'>⚠️</div>
            <h2 className='error-boundary-title'>Something went wrong</h2>
            <p className='error-boundary-message'>
              {this.state.error?.message || 'An unexpected error occurred.'}
            </p>
            <p className='error-boundary-hint'>
              This could be a temporary issue. Try refreshing the page or going back to the homepage.
            </p>
            <div className='error-boundary-actions'>
              <button
                className='error-boundary-btn error-boundary-btn-primary'
                onClick={this.handleRetry}
              >
                Try Again
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
                <summary>Technical Details</summary>
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
