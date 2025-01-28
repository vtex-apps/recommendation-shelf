import React, { Component, Fragment } from 'react'

class RecommendationShelfErrorBoundary extends Component<
  any,
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  public static getDerivedStateFromError() {
    return { hasError: true }
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error while rendering RecommendationShelf', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return <Fragment />
    }

    return this.props.children
  }
}

export function withRecommendationShelfErrorBoundary<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  const WithErrorBoundary = (props: P) => {
    return (
      <RecommendationShelfErrorBoundary>
        <WrappedComponent {...props} />
      </RecommendationShelfErrorBoundary>
    )
  }

  WithErrorBoundary.displayName = `WithRecommendationShelfErrorBoundary(${
    (WrappedComponent.displayName ?? WrappedComponent.name) || 'Component'
  })`

  return WithErrorBoundary
}
