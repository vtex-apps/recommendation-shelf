import { FunctionComponent } from 'react'

declare global {
  interface StorefrontFunctionComponent<P = {}> extends FunctionComponent<P> {
    schema?: object
    getSchema?(props?: P): object
  }

  interface Count {
    minimum?: number
    recommendations?: number
  }

  interface Sort {
    field?: string
    desc?: boolean
  }

  enum FilterField {
    TRADEPOLICY = 'trade_policy',
    SELLER = 'seller',
    BRAND = 'brand',
    CATEGORY = 'category',
  }

  enum FilterType {
    ONLY = 'only',
    REMOVE = 'remove',
  }

  interface Filter {
    field: FilterField
    condition: FilterType
    value: string
  }

  interface RecommendationOptions {
    count?: Count
    sort?: Sort[]
    filter?: Filter[]
  }

  enum RequestInputType {
    USER = 'USER',
    CATEGORY = 'CATEGORY',
    PRODUCT = 'PRODUCT',
    TAG_GROUP = 'TAG_GROUP',
    CAMPAIGN = 'CAMPAIGN',
    GROUP = 'GROUP',
    ANONYMOUS_USER = 'ANONYMOUS_USER',
    BRAND = 'BRAND',
    STORE = 'STORE',
  }

  interface InputRecommendation {
    type: {
      primary: RequestInputType
    }
    values?: string[]
  }

  interface Recommendation {
    base: Product[]
    recommended: Product[]
  }

  interface RecommendationResponse {
    recommendations: Recommendation[]
  }

  interface RecommendationAPI {
    variantId: string
    response: RecommendationResponse
  }

  interface Image {
    imageId?: string
    imageLabel: string
    imageTag?: string
    imageUrl: string
    imageText?: string
  }

  interface Property {
    name: string
    values: string[]
  }

  interface Reference {
    Key: string
    Value: string
  }

  interface Installment {
    InterestRate: number
    Name: string
    NumberOfInstallments: number
    TotalValuePlusInterestRate: number
    Value: number
  }

  interface CommertialOffer {
    AvailableQuantity: number
    Installments: Installment[]
    ListPrice: number
    Price: number
    PriceWithoutDiscount: number
    Tax: number
    taxPercentage: number
  }

  interface Seller {
    addToCartLink?: string
    commertialOffer: CommertialOffer
    sellerId: string
    sellerDefault?: boolean
    sellerName?: string
  }

  interface SKU {
    itemId: string
    name: string
    nameComplete?: string
    complementName?: string
    ean?: string
    referenceId: Reference[]
    measurementUnit: string
    unitMultiplier?: number
    images: Image[]
    sellers: Seller[]
    seller?: Seller
    variations: Property[]
  }

  interface ProductPriceRange {
    sellingPrice: PriceRange
    listPrice: PriceRange
  }

  interface PriceRange {
    highPrice: number
    lowPrice: number
  }

  interface SpecificationGroupProperty {
    originalName: string
    name: string
    values: string[]
  }

  interface SpecificationGroup {
    name?: string
    originalName?: string
    specifications?: SpecificationGroupProperty[]
  }

  interface Product {
    brand: string
    brandId: number
    cacheId: string
    categories: string[]
    categoryTree?: { slug: string }[]
    categoriesIds?: string[]
    description?: string
    items: SKU[]
    productId: string
    productName: string
    priceRange: ProductPriceRange
    link: string
    linkText: string
    productReference: string
    properties: string[]
    sku?: SKU
    specificationGroups?: SpecificationGroup[]
  }

  interface FacetValue {
    children?: FacetValue[]
    href?: string
    id: string
    key?: string
    link?: string
    linkEncoded?: string
    map: string
    name: string
    quantity?: number
    selected: boolean
    value: string
  }
}
