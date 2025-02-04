type NotifyParams = {
  campaignVrn: string
  correlationId: string
  productId: string
  userId: string
}

export async function notifyClick(params: NotifyParams) {
  const path = `/_v/api/recommendation-bff/campaign-click/v1`

  try {
    await fetch(path, {
      method: 'POST',
      body: JSON.stringify({
        campaignVrn: params.campaignVrn,
        userId: params.userId,
        correlationId: params.correlationId,
        productId: params.productId,
      }),
    })
  } catch (err) {
    console.error('Error while notifying campaign click', err)
  }
}
