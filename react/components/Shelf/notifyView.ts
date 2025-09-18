import { generateRecOriginHeader } from '../../utils/requests'
import { logger } from '../../utils/logger'

type NotifyView = {
  account: string
  correlationId: string
  products: string[]
  userId: string
}

export async function notifyView(params: NotifyView) {
  const path = `/api/recommend-bff/v2/events/recommendation-view?an=${params.account}`

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
    logger.error({
      message: 'Error while notifying recommendation view',
      data: err,
    })
  }
}
