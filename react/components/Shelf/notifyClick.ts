type NotifyParams = {
  correlationId: string
  productId: string
  userId: string
}

export async function notifyClick(params: NotifyParams) {
  const path = `/_v/api/recommendation-bff/events/recommendation-click/v2`

  try {
    await fetch(path, {
      method: 'POST',
      body: JSON.stringify({
        userId: params.userId,
        correlationId: params.correlationId,
        product: params.productId,
      }),
    })
  } catch (err) {
    console.error('Error while notifying campaign click', err)
  }
}
