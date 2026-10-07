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
    document.body.setAttribute(CONTROL_GROUP_BODY_ATTRIBUTE, 'control')
    expect(getAssignedVariant()).toBe('control')
  })

  it('falls back to localStorage when the body attribute is absent', () => {
    window.localStorage.setItem(CONTROL_GROUP_STORAGE_KEY, 'base')
    expect(getAssignedVariant()).toBe('base')
  })

  it('prefers the body attribute over localStorage', () => {
    document.body.setAttribute(CONTROL_GROUP_BODY_ATTRIBUTE, 'base')
    window.localStorage.setItem(CONTROL_GROUP_STORAGE_KEY, 'control')
    expect(getAssignedVariant()).toBe('base')
  })
})

describe('isControlGroup', () => {
  afterEach(() => {
    document.body.removeAttribute(CONTROL_GROUP_BODY_ATTRIBUTE)
    window.localStorage.clear()
  })

  it('flags the session as control group only for the control variant', () => {
    expect(isControlGroup()).toBe(false)

    document.body.setAttribute(CONTROL_GROUP_BODY_ATTRIBUTE, 'base')
    expect(isControlGroup()).toBe(false)

    document.body.setAttribute(CONTROL_GROUP_BODY_ATTRIBUTE, 'control')
    expect(isControlGroup()).toBe(true)
  })

  it('does not hide the shelf when the split script is absent', () => {
    // No body attribute and no localStorage value means the split script is
    // not running on the page, so the shelf must render normally.
    expect(document.body.hasAttribute(CONTROL_GROUP_BODY_ATTRIBUTE)).toBe(false)
    expect(window.localStorage.getItem(CONTROL_GROUP_STORAGE_KEY)).toBeNull()
    expect(isControlGroup()).toBe(false)
  })
})
