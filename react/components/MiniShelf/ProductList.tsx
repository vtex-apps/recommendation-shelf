import type { ComponentType, ReactNode } from 'react'
import React, { useEffect, useMemo, useRef } from 'react'
import ProductSummaryListWithoutQuery from 'vtex.product-summary/ProductSummaryListWithoutQuery'
import { ExtensionPoint, useTreePath } from 'vtex.render-runtime'
import type { Product } from 'recommend-bff'

import styles from './styles.css'

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
const ADD_BUTTON_SELECTOR =
  '.vtex-flex-layout-0-x-flexCol--rec-mini-shelf-action button'

// TODO: internationalize this message together with the other MiniShelf strings.
const getAddButtonLabel = (productName: string) => `Add ${productName} to cart`

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
        const rootRef = useRef<HTMLDivElement>(null)
        const product = props.product as Product | undefined

        useEffect(() => {
          const root = rootRef.current
          const productName = product?.productName

          if (!root || !productName) return

          const setAccessibleName = () => {
            const button = root.querySelector(ADD_BUTTON_SELECTOR)

            button?.setAttribute('aria-label', getAddButtonLabel(productName))
          }

          setAccessibleName()

          const observer = new MutationObserver(setAccessibleName)

          observer.observe(root, { childList: true, subtree: true })

          return () => observer.disconnect()
        }, [product])

        return (
          <div ref={rootRef} className={styles.productSummary}>
            <ExtensionPoint
              id="product-summary"
              treePath={treePath}
              {...props}
            />
          </div>
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
