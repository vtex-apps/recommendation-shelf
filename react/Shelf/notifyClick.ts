import { canUseDOM } from 'vtex.render-runtime'

import { getCookie } from '../utils/dom'

type NotifyParams = {
  campaignId: string
  correlationId: string
  itemId: string
}

export async function notifyClick(params: NotifyParams) {
  const uuid = canUseDOM ? getCookie('_snrs_uuid') : ''
  const path = `/_v/api/recommendation-bff/synerise/campaigns/${params.campaignId}/click-metric/v1`

  try {
    await fetch(path, {
      method: 'POST',
      body: JSON.stringify({
        synUserId: uuid,
        correlationId: params.correlationId,
        itemId: params.itemId,
      }),
    })
  } catch (err) {
    console.error('Error while notifying campaign click', err)
  }
}
