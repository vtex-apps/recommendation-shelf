type NotifyView = {
  correlationId: string
  products: string[]
  userId: string
}

export async function notifyView(params: NotifyView) {
  const path = `/_v/api/recommendation-bff/recommendation-view/v1`

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
    console.error('Error while notifying recommendation view', err)
  }
}
