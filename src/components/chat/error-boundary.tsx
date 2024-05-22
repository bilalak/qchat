import React, { Component } from "react"

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      // Render fallback UI here
      return <h1>Something went wrong, so please start a new chat or reach out to support if you have concerns.</h1>
    }
    return this.props.children
  }
}

export default ErrorBoundary
