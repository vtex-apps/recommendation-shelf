import React, { Component, Fragment } from 'react'

export class RecommendationShelfErrorBoundary extends Component<
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
    console.error(
      '[vtex.recommendation-shelf@2.x] Error while rendering RecommendationShelf',
      error,
      errorInfo
    )
  }

  public render() {
    if (this.state.hasError) {
      return <Fragment />
    }

    return this.props.children
  }
}
