import React from 'react'
import { render } from '@testing-library/react'

import { MiniShelfProductList } from './ProductList'

jest.mock(
  'vtex.product-summary/ProductSummaryListWithoutQuery',
  () => {
    return function ProductSummaryListMock({
      products,
      ProductSummary,
    }: {
      products: Array<Record<string, unknown>>
      ProductSummary: React.ComponentType<{ product: Record<string, unknown> }>
    }) {
      return (
        <>
          {products.map((product) => (
            <ProductSummary
              key={product.productId as string}
              product={product}
            />
          ))}
        </>
      )
    }
  },
  { virtual: true }
)

jest.mock(
  'vtex.render-runtime',
  () => ({
    ExtensionPoint: () => (
      <div className="vtex-flex-layout-0-x-flexCol--rec-mini-shelf-action">
        <button type="button">+</button>
      </div>
    ),
    useTreePath: () => ({ treePath: 'test' }),
  }),
  { virtual: true }
)

jest.mock('./styles.css', () => ({}))

describe('MiniShelfProductList', () => {
  it('gives each add button a product-specific accessible name', () => {
    const { getByRole } = render(
      <MiniShelfProductList
        products={[
          {
            productId: '1',
            productName: 'Straw Hat',
            items: [{ itemId: 'sku-1' }],
          },
        ]}
      />
    )

    expect(getByRole('button').getAttribute('aria-label')).toBe(
      'Add Straw Hat to cart'
    )
  })
})
