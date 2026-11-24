import React from 'react'
import { render } from '@testing-library/react'

import RecommendationMiniShelf from '../RecommendationMiniShelf'
import { CONTROL_GROUP_STORAGE_KEY } from '../utils/controlGroup'

jest.mock(
  'vtex.render-runtime',
  () => ({
    useRuntime: () => ({ route: { canonicalPath: '/checkout' } }),
  }),
  { virtual: true }
)

jest.mock('./RecommendationShelfContainer', () => ({
  RecommendationShelfContainer: () => (
    <div data-testid="recommendation-shelf-container" />
  ),
}))

const props = {
  campaignVrn: 'vrn:recommendations:store:rec-similar-v2:campaign',
  displayTitle: true,
  itemsContext: ['CART'] as ItemContextType[],
}

describe('RecommendationMiniShelf control group', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('renders when the group is base', () => {
    window.localStorage.setItem(CONTROL_GROUP_STORAGE_KEY, 'base')

    const { getByTestId } = render(<RecommendationMiniShelf {...props} />)

    expect(getByTestId('recommendation-shelf-container')).toBeTruthy()
  })

  it('renders nothing when the group is control', () => {
    window.localStorage.setItem(CONTROL_GROUP_STORAGE_KEY, 'control')

    const { queryByTestId } = render(<RecommendationMiniShelf {...props} />)

    expect(queryByTestId('recommendation-shelf-container')).toBeNull()
  })

  it('renders nothing while the group is missing', () => {
    const { queryByTestId } = render(<RecommendationMiniShelf {...props} />)

    expect(queryByTestId('recommendation-shelf-container')).toBeNull()
  })
})
