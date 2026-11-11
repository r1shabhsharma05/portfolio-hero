import { Component } from 'react'

// Error boundary for the Spline robot: @splinetool/react-spline throws
// synchronously when the scene fetch fails, and without a boundary React
// unmounts the WHOLE app (verified 2026-11-11: a blocked scene CDN
// blanked the entire portfolio). The boundary keeps a scene failure
// local to the hero slot — the rest of the page keeps working.
export class SplineErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-sm text-neutral-500">
            3D scene failed to load
          </span>
        </div>
      )
    }
    return this.props.children
  }
}
