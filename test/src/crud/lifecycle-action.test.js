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

  it('sets data and error to null if not passed', () => {
    const action = actionCreator()
    expect(action.data).toBeNull()
    expect(action.error).toBeNull()
  })
})
