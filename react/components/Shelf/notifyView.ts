type NotifyView = {
  correlationId: string
  products: string[]
  userId: string
}

export async function notifyView(params: NotifyView) {
  const path = '/_v/api/recommendation-bff/events/recommendation-view/v2'

  try {
    await fetch(path, {
      method: 'POST',
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
