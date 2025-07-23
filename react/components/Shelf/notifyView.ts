import { generateRecOriginHeader } from '../../utils/requests'

type NotifyView = {
  account: string
  correlationId: string
  products: string[]
  userId: string
}

export async function notifyView(params: NotifyView) {
  const path = `/api/recommend-bff/events/recommendation-view/v2?an=${params.account}`

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
        products: params.products,
      }),
    })
  } catch (err) {
    console.error(
      '[vtex.recommendation-shelf@2.x] Error while notifying recommendation view',
      err
    )
  }
}
