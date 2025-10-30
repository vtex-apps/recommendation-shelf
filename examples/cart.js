const querySelector = '.checkout-container'
const workspaceCookie = 'VtexWorkspace'
const targetWorkspace = 'master'

function getCookie(name) {
  const regex = new RegExp(`(^|;)[ ]*${name}=([^;]*)`)
  const match = regex.exec(document.cookie)

  return match ? decodeURIComponent(match[2]) : null
}

function insertIframeAfterCheckoutContainer() {
  const container = document.querySelector(querySelector)

  if (!container) return

  const iframeContainer = document.createElement('div')

  iframeContainer.className = 'recommendations-embedded-shelf'
  iframeContainer.style.width = '100%'
  iframeContainer.style.height = '750px'
  iframeContainer.style.overflow = 'hidden'

  const iframe = document.createElement('iframe')
  // URL defined in the store-theme.
  const iframeUrl = '/_v/public/recommendations-embedded-shelf/'

  iframe.src = iframeUrl
  iframe.style.width = '100%'
  iframe.style.height = '100%'
  iframe.style.border = 'none'
  iframe.style.marginTop = '-125px'
  iframe.scrolling = 'no'
  iframe.id = 'recommendations-embedded-shelf-iframe'

  // Skip displaying the iframe if the current workspace is not the target workspace. Used for A/B testing

  // const currentWorkspace = getCookie(workspaceCookie)
  // if (currentWorkspace === null || (currentWorkspace && !currentWorkspace.includes(targetWorkspace))) return

  iframeContainer.appendChild(iframe)
  container.parentNode.insertBefore(iframeContainer, container.nextSibling)

  setInterval(() => {
    // Validates if the iframe is on the correct page
    if (
      !iframe.contentWindow.location.href.includes(iframeUrl) &&
      !iframe.contentWindow.location.pathname.endsWith('/p') // it should allow redirects to pdp
    ) {
      iframe.contentWindow.location.href =
        iframe.contentWindow.location.origin + iframeUrl
    }
  }, 1000)
  // Syncronize the iframe url with the parent window to allow some navigations...
  iframe.contentWindow.navigation.addEventListener(
    'navigate',
    function handleIframeNavigate(navigate) {
      if (!navigate.destination.url.includes(iframeUrl)) {
        window.location.href = navigate.destination.url
      }

      if (navigate.destination.url.includes('/checkout/#/cart')) {
        window.location.reload()
      }
    }
  )
}

function tryInsertIframe(retries = 100, interval = 75) {
  const container = document.querySelector(querySelector)

  if (container) {
    insertIframeAfterCheckoutContainer()
  } else if (retries > 0) {
    setTimeout(() => tryInsertIframe(retries - 1, interval), interval)
  }
}

window.addEventListener('load', () => tryInsertIframe())
