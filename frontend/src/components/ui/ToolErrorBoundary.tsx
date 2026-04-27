/**
 * ToolErrorBoundary — a tool-specific ErrorBoundary that wraps only the
 * tool form + result section (not the entire page/navbar/footer).
 *
 * When a tool's React tree crashes (e.g. bad render in SmartResultDisplay,
 * a field component throwing, a client executor crashing synchronously),
 * this boundary catches it and shows a friendly recovery UI WITHOUT
 * unmounting the entire page shell. The user can:
 *   1) Wait for an auto-retry (up to 3 attempts, 1.5s apart)
 *   2) Click "Reset This Tool" to clear state
 *   3) Click "Reload Page" as last resort
 *
 * This is separate from the global ErrorBoundary in App.tsx which catches
 * router-level crashes. Having both layers means a tool can crash without
 * bringing down the navbar, footer, or offline banner.
 */
import { Component, type ErrorInfo, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  toolSlug?: string
  onReset?: () => void
}

interface State {
  hasError: boolean
  retryCount: number
  isRetrying: boolean
  errorMessage: string
}

const MAX_RETRIES = 3
const RETRY_DELAY = 1500

export class ToolErrorBoundary extends Component<Props, State> {
  private timer: ReturnType<typeof setTimeout> | null = null

  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, retryCount: 0, isRetrying: false, errorMessage: '' }
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, errorMessage: error?.message || 'Unexpected error' }
  }

  componentDidCatch(_error: Error, _info: ErrorInfo) {
    if (this.state.retryCount < MAX_RETRIES) {
      this.setState({ isRetrying: true })
      this.timer = setTimeout(() => {
        this.setState((prev) => ({
          hasError: false,
          retryCount: prev.retryCount + 1,
          isRetrying: false,
          errorMessage: '',
        }))
      }, RETRY_DELAY)
    }
  }

  componentDidUpdate(prevProps: Props) {
    // Reset boundary when the tool changes
    if (prevProps.toolSlug !== this.props.toolSlug) {
      if (this.timer) clearTimeout(this.timer)
      this.setState({ hasError: false, retryCount: 0, isRetrying: false, errorMessage: '' })
    }
  }

  componentWillUnmount() {
    if (this.timer) clearTimeout(this.timer)
  }

  handleReset = () => {
    if (this.timer) clearTimeout(this.timer)
    this.setState({ hasError: false, retryCount: 0, isRetrying: false, errorMessage: '' })
    this.props.onReset?.()
  }

  handleReload = () => window.location.reload()

  render() {
    if (!this.state.hasError) return this.props.children

    if (this.state.isRetrying) {
      return (
        <div className='tool-fallback-container'>
          <div className='tool-fallback-card'>
            <div className='tool-fallback-spinner' />
            <h3>Recovering…</h3>
            <p className='tool-fallback-sub'>
              Auto-retrying… (attempt {this.state.retryCount + 1} of {MAX_RETRIES})
            </p>
          </div>
        </div>
      )
    }

    return (
      <div className='tool-fallback-container'>
        <div className='tool-fallback-card'>
          <div className='tool-fallback-icon'>⚠️</div>
          <h3>This tool ran into a problem</h3>
          <p className='tool-fallback-sub'>
            Don't worry — your data is safe. This is usually temporary.
          </p>
          <div className='tool-fallback-actions'>
            <button className='tool-fallback-btn primary' onClick={this.handleReset}>
              <svg width='14' height='14' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='2' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8' />
                <path d='M3 3v5h5' />
                <path d='M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16' />
                <path d='M16 16h5v5' />
              </svg>
              Reset This Tool
            </button>
            <button className='tool-fallback-btn secondary' onClick={this.handleReload}>
              Reload Page
            </button>
          </div>
        </div>
      </div>
    )
  }
}
