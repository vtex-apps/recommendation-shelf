import {
  CONTROL_GROUP_BODY_ATTRIBUTE,
  CONTROL_GROUP_STORAGE_KEY,
  getAssignedVariant,
  isControlGroup,
} from './controlGroup'

describe('getAssignedVariant', () => {
  afterEach(() => {
    document.body.removeAttribute(CONTROL_GROUP_BODY_ATTRIBUTE)
    window.localStorage.clear()
  })

  it('returns null when no variant is assigned', () => {
    expect(getAssignedVariant()).toBeNull()
  })

  it('reads the variant from the body attribute', () => {
    document.body.setAttribute(CONTROL_GROUP_BODY_ATTRIBUTE, 'B')
    expect(getAssignedVariant()).toBe('B')
  })

  it('falls back to localStorage when the body attribute is absent', () => {
    window.localStorage.setItem(CONTROL_GROUP_STORAGE_KEY, 'A')
    expect(getAssignedVariant()).toBe('A')
  })

  it('prefers the body attribute over localStorage', () => {
    document.body.setAttribute(CONTROL_GROUP_BODY_ATTRIBUTE, 'A')
    window.localStorage.setItem(CONTROL_GROUP_STORAGE_KEY, 'B')
    expect(getAssignedVariant()).toBe('A')
  })
})

describe('isControlGroup', () => {
  afterEach(() => {
    document.body.removeAttribute(CONTROL_GROUP_BODY_ATTRIBUTE)
    window.localStorage.clear()
  })

  it('flags the session as control group only for the control variant', () => {
    expect(isControlGroup()).toBe(false)

    document.body.setAttribute(CONTROL_GROUP_BODY_ATTRIBUTE, 'A')
    expect(isControlGroup()).toBe(false)

    document.body.setAttribute(CONTROL_GROUP_BODY_ATTRIBUTE, 'B')
    expect(isControlGroup()).toBe(true)
  })
})
