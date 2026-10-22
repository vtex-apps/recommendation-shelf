import type { ComponentType, ReactNode } from 'react'
import React, { useMemo } from 'react'
import ProductSummaryListWithoutQuery from 'vtex.product-summary/ProductSummaryListWithoutQuery'
import { ExtensionPoint, useTreePath } from 'vtex.render-runtime'
import type { Product } from 'recommend-bff'

type Props = {
  products: Product[]
  buildExtraProductProps?: (
    product?: Record<string, string>,
    index?: number
  ) => Record<string, string | number | boolean | undefined>
  children?: ReactNode
}

// The installed typings are older than the runtime and miss some props.
const ProductList = ProductSummaryListWithoutQuery as ComponentType<any>

/**
 * Renders the products through the `product-summary` block declared directly
 * on the MiniShelf block (the same slot pattern as the `gallery` of
 * `vtex.search-result`), so themes can swap the summary without having to
 * redefine any `list-context` block. The MiniShelf `children` (the slider)
 * receive the rendered summaries through the list context.
 */
export function MiniShelfProductList({
  products,
  buildExtraProductProps,
  children,
}: Props) {
  const { treePath } = useTreePath()

  const ProductSummary = useMemo(
    () =>
      function MiniShelfProductSummary(props: Record<string, unknown>) {
        return (
          <ExtensionPoint id="product-summary" treePath={treePath} {...props} />
        )
      },
    [treePath]
  )

  return (
    <ProductList
      products={products}
      ProductSummary={ProductSummary}
      buildExtraProductProps={buildExtraProductProps}
    >
      {children}
    </ProductList>
  )
}
