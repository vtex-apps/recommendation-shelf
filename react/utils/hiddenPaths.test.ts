import { isPathHidden, normalizePath } from './hiddenPaths'

describe('normalizePath', () => {
  it('adds leading slash when missing', () => {
    expect(normalizePath('checkout')).toBe('/checkout')
  })

  it('removes trailing slash except for root', () => {
    expect(normalizePath('/checkout/')).toBe('/checkout')
    expect(normalizePath('/')).toBe('/')
  })

  it('returns root for empty path', () => {
    expect(normalizePath('')).toBe('/')
  })
})

describe('isPathHidden', () => {
  it('returns false when hiddenPaths is empty or undefined', () => {
    expect(isPathHidden('/checkout', undefined)).toBe(false)
    expect(isPathHidden('/checkout', [])).toBe(false)
  })

  it('matches exact paths', () => {
    expect(isPathHidden('/checkout/cart', ['/checkout/cart'])).toBe(true)
    expect(isPathHidden('/checkout/cart/', ['/checkout/cart'])).toBe(true)
    expect(isPathHidden('/checkout', ['/checkout/cart'])).toBe(false)
  })

  it('matches wildcard prefix paths', () => {
    expect(isPathHidden('/produto', ['/produto/*'])).toBe(true)
    expect(isPathHidden('/produto/sku-123', ['/produto/*'])).toBe(true)
    expect(isPathHidden('/produtos', ['/produto/*'])).toBe(false)
  })

  it('matches root path exactly', () => {
    expect(isPathHidden('/', ['/'])).toBe(true)
    expect(isPathHidden('/home', ['/'])).toBe(false)
  })
})
