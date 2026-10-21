import React from 'react'
import { render as rtlRender, fireEvent } from '@testing-library/react'
import { IntlProvider } from 'react-intl'

import MiniShelf from './index'

jest.mock(
  'vtex.render-runtime',
  () => ({
    ExtensionPoint: ({ id }: { id: string }) => <div data-testid={id} />,
    useRuntime: () => ({ account: 'test' }),
  }),
  { virtual: true }
)

jest.mock(
  'vtex.css-handles',
  () => ({
    useCssHandles: (handles: string[]) =>
      handles.reduce((acc: Record<string, string>, handle) => {
        acc[handle] = handle

        return acc
      }, {}),
  }),
  { virtual: true }
)

jest.mock('./styles.css', () => ({}))

jest.mock('../../utils/user', () => ({
  getCookie: () => 'cookie',
  startSession: jest.fn(),
}))

const render = (ui: React.ReactElement) =>
  rtlRender(ui, {
    wrapper: ({ children }) => (
      <IntlProvider locale="en">{children}</IntlProvider>
    ),
  })

const baseProps = {
  userId: 'user',
  correlationId: 'correlation',
  campaignId: 'campaign',
  displayTitle: true,
  title: 'You might also like',
  products: [{ productId: '1' }, { productId: '2' }] as any,
}

describe('MiniShelf', () => {
  it('starts expanded and renders the product list', () => {
    const { getByTestId, getByRole } = render(<MiniShelf {...baseProps} />)

    expect(getByTestId('list-context.product-list-static')).toBeTruthy()
    expect(getByRole('button').getAttribute('aria-expanded')).toBe('true')
  })

  it('collapses to the title bar and expands again on toggle', () => {
    const { queryByTestId, getByRole, getByText } = render(
      <MiniShelf {...baseProps} />
    )

    fireEvent.click(getByRole('button'))

    expect(queryByTestId('list-context.product-list-static')).toBeNull()
    expect(getByText('You might also like')).toBeTruthy()
    expect(getByRole('button').getAttribute('aria-expanded')).toBe('false')

    fireEvent.click(getByRole('button'))

    expect(queryByTestId('list-context.product-list-static')).toBeTruthy()
  })

  it('adds tracking attributes when correlation data is present', () => {
    const { container } = render(<MiniShelf {...baseProps} />)
    const root = container.firstChild as HTMLElement

    expect(root.getAttribute('data-af-campaign-id')).toBe('campaign')
    expect(root.getAttribute('data-af-products')).toBe('1, 2')
  })
})
