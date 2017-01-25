/* eslint-env jest */

import lifecycleAction from '~/src/crud/lifecycle-action'

describe('lifecycleAction', () => {
  const actionCreator = lifecycleAction('action.type', 'request', true)

  it('merges data correctly', () => {
    const action = actionCreator({ some: 'data' })
    expect(action).toMatchObject({
      type: 'action.type.request',
      isFetching: true,
      data: {
        some: 'data'
      }
    })
  })

  it('includes data but not error when passed that way', () => {
    const error = new Error({ some: 'data' })
    const action = actionCreator(null, error)
    expect(action).toMatchObject({
      type: 'action.type.request',
      isFetching: true,
      error
    })
  })

  it('does not include data/error if not passed', () => {
    const action = actionCreator()
    expect(action.data).toBeUndefined()
    expect(action.error).toBeUndefined()
  })
})
