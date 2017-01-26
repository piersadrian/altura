/* eslint-env jest */

import {
  configureDataAction,
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

describe('configureDataAction', () => {
  it('builds a data action', () => {
    const action = configureDataAction('action.type', { some: 'data' })
    expect(action.timestamp).not.toBeUndefined()
    expect(action).toMatchObject({
      type: 'action.type',
      data: {
        some: 'data'
      }
    })
  })
})
