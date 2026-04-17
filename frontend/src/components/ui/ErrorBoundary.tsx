import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'

type Props = {
  children: ReactNode
  fallback?: ReactNode
}

type State = {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('[ISHU TOOLS] Uncaught error:', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback
      return (
        <div className='error-boundary-fallback'>
          <div className='error-boundary-inner'>
            <div className='error-boundary-icon'>⚠️</div>
            <h2>Something went wrong</h2>
            <p>
              {this.state.error?.message || 'An unexpected error occurred. Please refresh the page and try again.'}
            </p>
            <button
              className='error-boundary-btn'
              onClick={() => this.setState({ hasError: false, error: null })}
            >
              Try again
            </button>
            <a href='/' className='error-boundary-link'>← Return to Home</a>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
