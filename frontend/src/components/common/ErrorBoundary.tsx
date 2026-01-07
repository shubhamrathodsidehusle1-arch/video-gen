import React from 'react'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-base-100">
          <div className="max-w-md w-full bg-base-200 shadow-lg rounded-lg p-6">
            <div className="text-center">
              <div className="text-error text-6xl mb-4">⚠️</div>
              <h1 className="text-2xl font-bold text-base-content mb-4">Something went wrong</h1>
              <p className="text-base-content/70 mb-6">
                We encountered an unexpected error. Please refresh the page or contact support if the problem persists.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => window.location.reload()}
              >
                Refresh Page
              </button>
              {process.env.NODE_ENV === 'development' && this.state.error && (
                <details className="mt-4 text-left">
                  <summary className="cursor-pointer text-sm text-base-content/70">
                    Error Details (Development)
                  </summary>
                  <pre className="mt-2 text-xs bg-base-300 p-2 rounded overflow-auto">
                    {this.state.error.toString()}
                  </pre>
                </details>
              )}
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}