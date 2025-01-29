export type RecommendationVrnType =
  | 'rec-cross-v1'
  | 'rec-similar-v1'
  | 'rec-cart-v1'
  | 'rec-persona-v1'
  | 'rec-last-v1'
  | 'rec-recent-int-v1'
  | 'rec-top-items-v1'

const vrnPattern =
  /^vrn:recommendations:[^:]+:(rec-cross-v1|rec-similar-v1|rec-cart-v1|rec-persona-v1|rec-last-v1|rec-recent-int-v1|rec-top-items-v1):[^:]+$/

export function isValidVrn(campaignVrn: string): boolean {
  return vrnPattern.test(campaignVrn)
}

export function parseCampaignVrn(campaignVrn?: string): {
  campaignId: string
  campaignType: RecommendationVrnType
} {
  if (!campaignVrn || !isValidVrn(campaignVrn)) {
    return { campaignId: '', campaignType: 'rec-top-items-v1' }
  }

  const list = campaignVrn.split(':')

  return { campaignId: list[4], campaignType: list[3] as RecommendationVrnType }
}
