import { canUseDOM } from 'vtex.render-runtime'

import { getCookie } from '../utils/dom'

type NotifyParams = {
  campaignVrn: string
  correlationId: string
  productId: string
}

export async function notifyClick(params: NotifyParams) {
  const uuid = canUseDOM ? getCookie('_snrs_uuid') : ''
  const path = `/_v/api/recommendation-bff/campaign-click/v1`

  try {
    await fetch(path, {
      method: 'POST',
      body: JSON.stringify({
        userId: uuid,
        correlationId: params.correlationId,
        productId: params.productId,
      }),
    })
  } catch (err) {
    console.error('Error while notifying campaign click', err)
  }
}
