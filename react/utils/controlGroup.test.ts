import {
  CONTROL_GROUP_STORAGE_KEY,
  getAssignedVariant,
  isControlGroup,
  watchShelfVisibility,
} from './controlGroup'

describe('getAssignedVariant', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('returns null when no variant is assigned', () => {
    expect(getAssignedVariant()).toBeNull()
  })

  it('reads base and control from localStorage', () => {
    window.localStorage.setItem(CONTROL_GROUP_STORAGE_KEY, 'control')
    expect(getAssignedVariant()).toBe('control')

    window.localStorage.setItem(CONTROL_GROUP_STORAGE_KEY, 'base')
    expect(getAssignedVariant()).toBe('base')
  })

  it('ignores a value that is not a group', () => {
    window.localStorage.setItem(CONTROL_GROUP_STORAGE_KEY, 'other')
    expect(getAssignedVariant()).toBeNull()
  })
})

describe('isControlGroup', () => {
  afterEach(() => {
    window.localStorage.clear()
  })

  it('flags the session as control group only for the control variant', () => {
    expect(isControlGroup()).toBe(false)

    window.localStorage.setItem(CONTROL_GROUP_STORAGE_KEY, 'base')
    expect(isControlGroup()).toBe(false)

    window.localStorage.setItem(CONTROL_GROUP_STORAGE_KEY, 'control')
    expect(isControlGroup()).toBe(true)
  })

  it('stays hidden until base is assigned', () => {
    jest.useFakeTimers()
    const onChange = jest.fn()
    const stop = watchShelfVisibility(onChange)

    expect(onChange).not.toHaveBeenCalled()
    window.localStorage.setItem(CONTROL_GROUP_STORAGE_KEY, 'base')
    jest.advanceTimersByTime(1000)

    expect(onChange).toHaveBeenCalledWith('show')
    stop()
    jest.useRealTimers()
  })

  it('notices a control assignment that arrives after the shelf mounted', () => {
    jest.useFakeTimers()
    const onChange = jest.fn()
    const stop = watchShelfVisibility(onChange)

    window.localStorage.setItem(CONTROL_GROUP_STORAGE_KEY, 'control')
    jest.advanceTimersByTime(1000)

    expect(onChange).toHaveBeenCalledWith('hide')
    stop()
    jest.useRealTimers()
  })

  it('notices a late localStorage assignment', () => {
    jest.useFakeTimers()
    const onChange = jest.fn()
    const stop = watchShelfVisibility(onChange)

    window.localStorage.setItem(CONTROL_GROUP_STORAGE_KEY, 'control')
    jest.advanceTimersByTime(1000)

    expect(onChange).toHaveBeenCalledWith('hide')
    stop()
    jest.useRealTimers()
  })

  it('stays hidden when no group arrives within five retries', () => {
    jest.useFakeTimers()
    const onChange = jest.fn()
    const stop = watchShelfVisibility(onChange)

    jest.advanceTimersByTime(5000)

    expect(onChange).not.toHaveBeenCalled()
    stop()
    jest.useRealTimers()
  })

  it('does not treat a missing key as control', () => {
    expect(window.localStorage.getItem(CONTROL_GROUP_STORAGE_KEY)).toBeNull()
    expect(isControlGroup()).toBe(false)
    expect(getAssignedVariant()).toBeNull()
  })
})
