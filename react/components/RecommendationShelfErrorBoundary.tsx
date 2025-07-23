import React, { Component, Fragment } from 'react'

import { logger } from '../utils/logger'

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
    logger.error({
      message: 'Error while rendering RecommendationShelf',
      data: { error, errorInfo },
    })
  }

  public render() {
    if (this.state.hasError) {
      return <Fragment />
    }

    return this.props.children
  }
}
