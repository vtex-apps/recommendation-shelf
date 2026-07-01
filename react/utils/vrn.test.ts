import { getTypeFromVrn, isValidVrn } from './vrn'

const buildVrn = (type: string) =>
  `vrn:recommendations:myaccount:${type}:campaign-123`

describe('isValidVrn', () => {
  const validV2Types = [
    'rec-cross-v2',
    'rec-similar-v2',
    'rec-visual-v2',
    'rec-persona-v2',
    'rec-last-v2',
    'rec-top-items-v2',
    'rec-search-v2',
    'rec-next-v2',
  ]

  it.each(validV2Types)('returns true for a valid v2 VRN (%s)', (type) => {
    expect(isValidVrn(buildVrn(type))).toBe(true)
  })

  const deprecatedV1Types = [
    'rec-cross-v1',
    'rec-similar-v1',
    'rec-visual-v1',
    'rec-persona-v1',
    'rec-last-v1',
    'rec-top-items-v1',
  ]

  it.each(deprecatedV1Types)(
    'returns false for a deprecated v1 VRN (%s)',
    (type) => {
      expect(isValidVrn(buildVrn(type))).toBe(false)
    }
  )

  it('returns false for an unknown campaign type', () => {
    expect(isValidVrn(buildVrn('rec-unknown-v2'))).toBe(false)
  })

  it('returns false for a malformed VRN', () => {
    expect(isValidVrn('not-a-vrn')).toBe(false)
    expect(isValidVrn('vrn:recommendations:myaccount:rec-cross-v2')).toBe(false)
    expect(isValidVrn('')).toBe(false)
  })
})

describe('getTypeFromVrn', () => {
  const cases: Array<[string, RecommendationType]> = [
    ['rec-cross-v2', 'CROSS_SELL'],
    ['rec-similar-v2', 'SIMILAR_ITEMS'],
    ['rec-visual-v2', 'VISUAL_SIMILARITY'],
    ['rec-persona-v2', 'PERSONALIZED'],
    ['rec-last-v2', 'LAST_SEEN'],
    ['rec-top-items-v2', 'TOP_ITEMS'],
    ['rec-search-v2', 'SEARCH_BASED'],
    ['rec-next-v2', 'NEXT_INTERACTION'],
  ]

  it.each(cases)('maps %s to %s', (type, expected) => {
    expect(getTypeFromVrn(buildVrn(type))).toBe(expected)
  })

  it('maps rec-visual-v2 to VISUAL_SIMILARITY', () => {
    expect(getTypeFromVrn(buildVrn('rec-visual-v2'))).toBe('VISUAL_SIMILARITY')
  })

  it('throws for an unknown campaign type', () => {
    expect(() => getTypeFromVrn(buildVrn('rec-unknown-v2'))).toThrow(
      'Unknown campaign type: rec-unknown-v2'
    )
  })

  it('throws for a deprecated v1 campaign type', () => {
    expect(() => getTypeFromVrn(buildVrn('rec-cross-v1'))).toThrow(
      'Unknown campaign type: rec-cross-v1'
    )
  })
})
