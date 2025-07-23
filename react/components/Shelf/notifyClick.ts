import { generateRecOriginHeader } from '../../utils/requests'

type NotifyParams = {
  account: string
  correlationId: string
  productId: string
  userId: string
}

export async function notifyClick(params: NotifyParams) {
  const path = `/api/recommend-bff/events/recommendation-click/v2?an=${params.account}`

  try {
    await fetch(path, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...generateRecOriginHeader(params.account),
      },
      body: JSON.stringify({
        userId: params.userId,
        correlationId: params.correlationId,
        product: params.productId,
      }),
    })
  } catch (err) {
    console.error(
      '[vtex.recommendation-shelf@2.x] Error while notifying campaign click',
      err
    )
  }
}
