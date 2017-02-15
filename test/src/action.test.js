/* eslint-env jest */

import {
  dataAction,
  makeActionPath,
  makeActionType
} from '~/src/action'

describe('makeActionPath', () => {
  it('splits an action path by separator', () => {
    expect(makeActionPath('action.type')).toEqual(['action', 'type'])
  })
})

describe('makeActionType', () => {
  it('splits an action path by separator', () => {
    expect(makeActionType('action', 'type')).toEqual('action.type')
  })
})

describe('dataAction', () => {
  it('builds a data action', () => {
    const action = dataAction('action.type', { some: 'data' })
    expect(action.timestamp).not.toBeUndefined()
    expect(action).toMatchObject({
      type: 'action.type',
      data: {
        some: 'data'
      }
    })
  })
})
