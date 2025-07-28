export function generateRecOriginHeader(account: string) {
  return {
    'x-vtex-rec-origin': `${account}/storefront/vtex.recommendation-shelf@2.x`,
  }
}
