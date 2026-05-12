/**
 * Vanilla recommendation shelf for VTEX Checkout V6 (cart page).
 * Configure SHELF_CONFIG below, then add this script to Checkout > Custom Scripts.
 *
 * @see examples/cart.js for the previous iframe-based approach.
 */
;(function () {
  'use strict'

  const QUERY_SELECTOR = '.checkout-container'
  const CONTAINER_CLASS = 'recommendations-embedded-shelf'
  const LOG_PREFIX = '[vtex.recommendation-shelf@2.x]'

  const VRN_PATTERN =
    /^vrn:recommendations:[^:]+:(rec-cross-v1|rec-similar-v1|rec-persona-v1|rec-last-v1|rec-top-items-v1|rec-cross-v2|rec-similar-v2|rec-persona-v2|rec-last-v2|rec-top-items-v2|rec-search-v2):[^:]+$/

  const USER_START_SESSION_COOKIE = 'vtex-rec-user-start-session'
  const workspaceCookie = 'VtexWorkspace'
  const targetWorkspace = 'master'

  /**
   * Edit before deploying.
   * @type {{
   *   account: string
   *   campaignVrn: string
   *   title?: string
   *   displayTitle?: boolean
   *   itemsPerPage?: { desktop: number; tablet: number; phone: number }
   * }}
   */
  const SHELF_CONFIG = {
    account: 'acmestore',
    campaignVrn:
      'vrn:recommendations:acmestore:rec-cross-v2:00000000-0000-0000-0000-000000000000',
    title: '',
    displayTitle: true,
    itemsPerPage: { desktop: 5, tablet: 3, phone: 2 },
  }

  let stylesInjected = false

  function warn(message, data) {
    console.warn(LOG_PREFIX, message, data !== undefined ? data : '')
  }

  function getCookie(name) {
    const regex = new RegExp('(^|;)[ ]*' + name + '=([^;]*)')
    const match = regex.exec(document.cookie)
    return match ? decodeURIComponent(match[2]) : null
  }

  function getWithRetry(getFn, retries, delay) {
    retries = retries === undefined ? 30 : retries
    delay = delay === undefined ? 200 : delay
    return new Promise(function (resolve, reject) {
      function attempt(n) {
        try {
          const result = getFn()
          if (!result) {
            throw new Error('Result is undefined or null')
          }
          resolve(result)
        } catch (error) {
          if (n <= 1) {
            reject(error)
          } else {
            setTimeout(function () {
              attempt(n - 1)
            }, delay + (retries - n) * delay)
          }
        }
      }
      attempt(retries)
    })
  }

  function ensureUserIdCookies() {
    if (typeof document === 'undefined') {
      return Promise.resolve()
    }
    return getWithRetry(
      function () {
        const vtexRecUserId = getCookie('vtex-rec-user-id')
        if (vtexRecUserId) {
          return { vtexRecUserId: vtexRecUserId }
        }
        throw new Error('No cookies available')
      },
      15,
      200
    )
      .then(function (cookieState) {
        if (cookieState.vtexRecUserId) {
          return
        }
      })
      .catch(function () {
        /* no-op */
      })
  }

  function getUserIdFromCookie() {
    return getCookie('vtex-rec-user-id') || ''
  }

  function getUserIdWithRetry() {
    return getWithRetry(
      function () {
        const id = getUserIdFromCookie()
        if (!id) throw new Error('No userId')
        return id
      },
      30,
      200
    )
  }

  function isValidVrn(campaignVrn) {
    return VRN_PATTERN.test(campaignVrn)
  }

  function getTypeFromVrn(campaignVrn) {
    const parts = campaignVrn.split(':')
    var campaignVrnType = parts[3]
    switch (campaignVrnType) {
      case 'rec-cross-v1':
      case 'rec-cross-v2':
        return 'CROSS_SELL'
      case 'rec-similar-v1':
      case 'rec-similar-v2':
        return 'SIMILAR_ITEMS'
      case 'rec-persona-v1':
      case 'rec-persona-v2':
        return 'PERSONALIZED'
      case 'rec-last-v1':
      case 'rec-last-v2':
        return 'LAST_SEEN'
      case 'rec-top-items-v1':
      case 'rec-top-items-v2':
        return 'TOP_ITEMS'
      case 'rec-search-v2':
        return 'SEARCH_BASED'
      default:
        throw new Error('Unknown campaign type: ' + campaignVrnType)
    }
  }

  function getRecommendationQueryParams(account, userId, campaignVrn, productIds) {
    if (!userId) return null
    var recommendationType
    try {
      recommendationType = getTypeFromVrn(campaignVrn)
    } catch (e) {
      return null
    }

    var params = {
      an: account,
      userId: userId,
      campaignVrn: campaignVrn,
    }

    var productsParam
    if (
      recommendationType === 'VISUAL_SIMILARITY' ||
      recommendationType === 'SIMILAR_ITEMS'
    ) {
      if (!productIds.length) return null
      productsParam = productIds[0]
    } else if (recommendationType === 'CROSS_SELL') {
      if (!productIds.length) return null
      productsParam = productIds.join(';')
    }

    if (productsParam) {
      params.products = productsParam
    }
    return params
  }

  function recOriginHeader(account) {
    return {
      'x-vtex-rec-origin': account + '/storefront/vtex.recommendation-shelf@2.x',
    }
  }

  function fetchRecommendations(account, userId, campaignVrn, productIds) {
    var params = getRecommendationQueryParams(account, userId, campaignVrn, productIds)
    if (!params) {
      return Promise.reject(new Error('Missing recommendation query params'))
    }
    var qs = new URLSearchParams(params).toString()
    return fetch('/api/recommend-bff/v2/recommendations?' + qs, {
      method: 'GET',
      headers: recOriginHeader(account),
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status)
      }
      return response.json()
    })
  }

  function startSession(account) {
    if (getCookie(USER_START_SESSION_COOKIE)) {
      return Promise.resolve(null)
    }
    var body = {}
    return fetch(
      '/api/recommend-bff/v2/users/start-session?an=' + encodeURIComponent(account),
      {
        method: 'POST',
        headers: Object.assign(
          { 'Content-Type': 'application/json' },
          recOriginHeader(account)
        ),
        body: JSON.stringify(body),
      }
    ).then(function (response) {
      if (!response.ok) {
        throw new Error('HTTP error! status: ' + response.status)
      }
      return response.json()
    })
  }

  function getOrderForm() {
    return fetch('/api/checkout/pub/orderForm', {
      method: 'GET',
      credentials: 'include',
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('OrderForm HTTP ' + response.status)
      }
      return response.json()
    })
  }

  function addToCart(orderFormId, skuId, seller) {
    return fetch(
      '/api/checkout/pub/orderForm/' + encodeURIComponent(orderFormId) + '/items',
      {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderItems: [{ id: String(skuId), quantity: 1, seller: String(seller) }],
        }),
      }
    ).then(function (response) {
      if (!response.ok) {
        throw new Error('Add to cart HTTP ' + response.status)
      }
      return response.json()
    })
  }

  function pickSkuAndSeller(product) {
    if (!product || !product.items || !product.items.length) {
      return null
    }
    var item =
      product.items.find(function (it) {
        return (
          it.sellers &&
          it.sellers.some(function (s) {
            return s.commertialOffer && s.commertialOffer.AvailableQuantity > 0
          })
        )
      }) || product.items[0]
    var seller =
      item.sellers &&
      item.sellers.find(function (s) {
        return s.commertialOffer && s.commertialOffer.AvailableQuantity > 0
      })
    if (!seller) {
      seller = item.sellers && item.sellers[0]
    }
    if (!seller) return null
    return { skuId: item.itemId, seller: seller.sellerId }
  }

  function formatPrice(value, currencyCode) {
    if (value == null || isNaN(Number(value))) return ''
    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency: currencyCode || 'BRL',
        minimumFractionDigits: 2,
      }).format(Number(value))
    } catch (_e) {
      return Number(value).toFixed(2)
    }
  }

  function getImageUrl(product) {
    var item = product.items && product.items[0]
    var image =
      item &&
      item.images &&
      item.images[0] &&
      (item.images[0].imageUrl || item.images[0].imageTag)
    return image || ''
  }

  function getSellingPrice(product) {
    var item = product.items && product.items[0]
    var offer =
      item && item.sellers && item.sellers[0] && item.sellers[0].commertialOffer
    if (offer) {
      if (offer.Price != null) return offer.Price
      if (offer.spotPrice != null) return offer.spotPrice
    }
    var range = product.priceRange && product.priceRange.sellingPrice
    if (range && range.lowPrice != null) return range.lowPrice
    return null
  }

  function getProductName(product) {
    return product.productName || product.productTitle || ''
  }

  function getProductPath(product) {
    if (product.link) {
      try {
        var u = new URL(product.link, window.location.origin)
        return u.pathname + (u.search || '')
      } catch (_e) {
        return product.link
      }
    }
    var slug = product.linkText || ''
    return '/' + slug + '/p'
  }

  function injectStyles() {
    if (stylesInjected) return
    stylesInjected = true
    var style = document.createElement('style')
    style.textContent =
      '@keyframes rs-shimmer{0%{transform:translate3d(0,0,0)}100%{transform:translate3d(50%,0,0)}}' +
      '.' +
      CONTAINER_CLASS +
      '{width:100%;box-sizing:border-box;margin:1rem 0;font-family:inherit}' +
      '.rs-title{font-weight:600;font-size:1.25rem;text-align:center;margin:1rem 0}' +
      '.rs-track{display:flex;gap:1.5rem;overflow-x:auto;scroll-snap-type:x mandatory;padding:0.5rem 0;-webkit-overflow-scrolling:touch}' +
      '.rs-card{flex:0 0 auto;width:min(280px,75vw);scroll-snap-align:start;border:1px solid #e3e4e6;border-radius:8px;padding:12px;background:#fff;display:flex;flex-direction:column;gap:8px}' +
      '.rs-card-img{width:100%;aspect-ratio:1;object-fit:contain;background:#f7f7f7;border-radius:4px}' +
      '.rs-card-name{font-size:0.9rem;line-height:1.3;color:#333;text-decoration:none;min-height:2.6em}' +
      '.rs-card-price{font-weight:600;font-size:1rem}' +
      '.rs-btn-add{width:100%;padding:10px 12px;border:none;border-radius:4px;background:#134cd8;color:#fff;font-size:0.875rem;cursor:pointer}' +
      '.rs-btn-add:disabled{opacity:0.6;cursor:not-allowed}' +
      '.rs-skel{display:flex;gap:1.5rem;overflow:hidden}' +
      '.rs-skel-piece{height:380px;width:min(300px,75vw);flex-shrink:0;background:#eee;border-radius:8px;position:relative;overflow:hidden}' +
      '.rs-skel-piece::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,0.3),rgba(255,255,255,0));background-size:50% 100%;animation:rs-shimmer 1s linear infinite}'
    document.head.appendChild(style)
  }

  function deviceSkeletonCount(itemsPerPage) {
    var w = typeof window !== 'undefined' ? window.innerWidth : 768
    if (w <= 768) return itemsPerPage.phone
    if (w <= 1024) return itemsPerPage.tablet
    return itemsPerPage.desktop
  }

  function renderSkeleton(root, itemsPerPage) {
    var n = deviceSkeletonCount(itemsPerPage)
    var track = document.createElement('div')
    track.className = 'rs-skel'
    for (var i = 0; i < n; i++) {
      var piece = document.createElement('div')
      piece.className = 'rs-skel-piece'
      track.appendChild(piece)
    }
    root.appendChild(track)
  }

  function setBooleanDataAttr(el, name, value) {
    if (value) {
      el.setAttribute(name, 'true')
    } else {
      el.removeAttribute(name)
    }
  }

  function renderShelf(root, options) {
    var title = options.title
    var displayTitle = options.displayTitle !== false
    var products = options.products
    var correlationId = options.correlationId
    var campaignId = options.campaignId
    var currencyCode = options.currencyCode || 'BRL'
    var orderFormId = options.orderFormId

    root.textContent = ''

    var productIdsStr = products
      .map(function (p) {
        return p && p.productId
      })
      .filter(Boolean)
      .join(', ')
    var shouldAddAF = !!(correlationId && campaignId && productIdsStr.length)

    var wrap = document.createElement('div')
    wrap.className = 'recommendationShelfContainer'

    wrap.setAttribute('data-af-element', 'recommendation-shelf')
    setBooleanDataAttr(wrap, 'data-af-onimpression', shouldAddAF)
    setBooleanDataAttr(wrap, 'data-af-onview', shouldAddAF)
    if (shouldAddAF) {
      wrap.setAttribute('data-af-correlation-id', correlationId)
      wrap.setAttribute('data-af-campaign-id', campaignId)
      wrap.setAttribute('data-af-products', productIdsStr)
    }

    if (title && displayTitle) {
      var titleEl = document.createElement('div')
      titleEl.className = 'rs-title'
      titleEl.textContent = title
      wrap.appendChild(titleEl)
    }

    var track = document.createElement('div')
    track.className = 'rs-track'

    products.forEach(function (product, index) {
      if (!product) return

      var productId = product.productId
      var position = index + 1

      var card = document.createElement('div')
      card.className = 'rs-card'

      if (shouldAddAF && productId) {
        card.setAttribute('data-af-element', 'recommendation-shelf-product')
        card.setAttribute('data-af-correlation-id', correlationId)
        card.setAttribute('data-af-campaign-id', campaignId)
        card.setAttribute('data-af-product-id', productId)
        setBooleanDataAttr(card, 'data-af-onclick', true)
        card.setAttribute('data-af-product-position', String(position))
      }

      var img = document.createElement('img')
      img.className = 'rs-card-img'
      img.alt = ''
      img.loading = 'lazy'
      img.src = getImageUrl(product) || ''
      card.appendChild(img)

      var link = document.createElement('a')
      link.className = 'rs-card-name'
      link.href = getProductPath(product) || '#'
      link.textContent = getProductName(product)
      card.appendChild(link)

      var priceEl = document.createElement('div')
      priceEl.className = 'rs-card-price'
      priceEl.textContent = formatPrice(getSellingPrice(product), currencyCode)
      card.appendChild(priceEl)

      var pick = pickSkuAndSeller(product)
      var btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'rs-btn-add'
      btn.textContent = 'Add to cart'
      if (!pick || !orderFormId) {
        btn.disabled = true
      } else {
        btn.addEventListener('click', function (ev) {
          ev.preventDefault()
          ev.stopPropagation()
          btn.disabled = true
          addToCart(orderFormId, pick.skuId, pick.seller)
            .then(function () {
              window.location.reload()
            })
            .catch(function (err) {
              warn('Add to cart failed', err)
              btn.disabled = false
            })
        })
      }
      card.appendChild(btn)

      track.appendChild(card)
    })

    wrap.appendChild(track)
    root.appendChild(wrap)
  }

  function removeNode(node) {
    if (node && node.parentNode) {
      node.parentNode.removeChild(node)
    }
  }

  function runPipeline(outer) {
    var account = SHELF_CONFIG.account
    var campaignVrn = SHELF_CONFIG.campaignVrn

    if (!campaignVrn || !isValidVrn(campaignVrn)) {
      warn('Shelf not displayed: invalid or empty campaignVrn', { campaignVrn })
      removeNode(outer)
      return
    }

    ensureUserIdCookies()
      .then(function () {
        return getUserIdWithRetry()
      })
      .then(function (userId) {
        return getOrderForm().then(function (orderForm) {
          return { userId: userId, orderForm: orderForm }
        })
      })
      .then(function (ctx) {
        // Use every item in the orderForm as product context for the recommendations
        // request. We filter out items without a productId first to avoid the
        // String(undefined) === "undefined" pitfall, then dedupe to keep a single
        // entry per product even when multiple SKUs of the same product are in the cart.
        var orderFormItems = ctx.orderForm.items || []
        var productIds = Array.from(
          new Set(
            orderFormItems
              .map(function (it) {
                return it && it.productId ? String(it.productId) : ''
              })
              .filter(Boolean)
          )
        )
        return fetchRecommendations(account, ctx.userId, campaignVrn, productIds)
          .then(function (data) {
            return {
              orderForm: ctx.orderForm,
              userId: ctx.userId,
              data: data,
            }
          })
      })
      .then(function (ctx) {
        var data = ctx.data
        if (!data || !data.products || !data.products.length) {
          warn('Shelf not displayed: missing products or empty response', {
            campaignVrn: campaignVrn,
          })
          removeNode(outer)
          return null
        }
        var of = ctx.orderForm
        var currency =
          (of.storePreferencesData && of.storePreferencesData.currencyCode) ||
          'BRL'
        var title =
          (SHELF_CONFIG.title && String(SHELF_CONFIG.title)) ||
          (data.campaign && data.campaign.title) ||
          ''

        outer.textContent = ''
        renderShelf(outer, {
          title: title,
          displayTitle: SHELF_CONFIG.displayTitle,
          products: data.products,
          correlationId: data.correlationId || '',
          campaignId: (data.campaign && data.campaign.id) || '',
          currencyCode: currency,
          orderFormId: of.orderFormId,
        })

        return startSession(account).catch(function (err) {
          warn('start-session failed', err)
        })
      })
      .catch(function (err) {
        warn('Recommendation shelf pipeline error', err)
        removeNode(outer)
      })
  }

  function insertShelfAfterCheckoutContainer() {
    if (document.querySelector('.' + CONTAINER_CLASS)) {
      return
    }

    var container = document.querySelector(QUERY_SELECTOR)
    if (!container) return

    // Skip displaying if the current workspace is not the target workspace. Used for A/B testing
    // const currentWorkspace = getCookie(workspaceCookie)
    // if (currentWorkspace === null || (currentWorkspace && !currentWorkspace.includes(targetWorkspace))) return

    injectStyles()

    var outer = document.createElement('div')
    outer.className = CONTAINER_CLASS
    outer.style.width = '100%'
    outer.style.boxSizing = 'border-box'

    renderSkeleton(outer, SHELF_CONFIG.itemsPerPage || { desktop: 5, tablet: 3, phone: 2 })
    container.parentNode.insertBefore(outer, container.nextSibling)

    runPipeline(outer)
  }

  function tryInsertShelf(retries, interval) {
    retries = retries === undefined ? 100 : retries
    interval = interval === undefined ? 75 : interval
    var el = document.querySelector(QUERY_SELECTOR)
    if (el) {
      insertShelfAfterCheckoutContainer()
    } else if (retries > 0) {
      setTimeout(function () {
        tryInsertShelf(retries - 1, interval)
      }, interval)
    }
  }

  window.addEventListener('load', function () {
    tryInsertShelf()
  })
})()
