import { generateRecOriginHeader } from '../../utils/requests'
import { logger } from '../../utils/logger'

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
    logger.error({
      message: 'Error while notifying campaign click',
      data: err,
    })
  }
}
