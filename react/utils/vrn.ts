/* eslint-disable padding-line-between-statements */

type RecommendationVrnType =
  | 'rec-cross-v1'
  | 'rec-similar-v1'
  | 'rec-persona-v1'
  | 'rec-last-v1'
  | 'rec-top-items-v1'
  | 'rec-cross-v2'
  | 'rec-similar-v2'
  | 'rec-persona-v2'
  | 'rec-last-v2'
  | 'rec-top-items-v2'

const vrnPattern =
  /^vrn:recommendations:[^:]+:(rec-cross-v1|rec-similar-v1|rec-persona-v1|rec-last-v1|rec-top-items-v1|rec-cross-v2|rec-similar-v2|rec-persona-v2|rec-last-v2|rec-top-items-v2):[^:]+$/

export function isValidVrn(campaignVrn: string): boolean {
  return vrnPattern.test(campaignVrn)
}

function parseCampaignVrn(campaignVrn: string) {
  const [_, __, accountName, campaignType, campaignId] = campaignVrn.split(':')

  return {
    accountName,
    campaignId,
    campaignVrnType: campaignType as RecommendationVrnType,
  }
}

// Cross-sell: rec-cross-v1,  rec-cross-v2
// Similar-items: rec-similar-v1, rec-similar-v2
// Cart Recommmendations: rec-cart-v1, rec-cart-v2
// Personalized: rec-persona-v1, rec-persona-v2
// Last Seen: rec-last-v1, rec-last-v2
// Top items: rec-top-items-v1, rec-top-items-v2
// Recent interactions: rec-recent-int-v1, rec-recent-int-v2
export function getTypeFromVrn(campaignVrn: string): RecommendationType {
  const { campaignVrnType } = parseCampaignVrn(campaignVrn)

  switch (campaignVrnType) {
    case 'rec-cross-v1':
    case 'rec-cross-v2':
      return 'CROSS_SELL'

    case 'rec-similar-v1':
    case 'rec-similar-v2':
      return 'SIMILAR_ITEMS'

    case 'rec-persona-v1':
    case 'rec-persona-v2':
      return 'PERSONALIZED'

    case 'rec-last-v1':
    case 'rec-last-v2':
      return 'LAST_SEEN'

    case 'rec-top-items-v1':
    case 'rec-top-items-v2':
      return 'TOP_ITEMS'

    default:
      throw new Error(`Unknown campaign type: ${campaignVrnType}`)
  }
}
