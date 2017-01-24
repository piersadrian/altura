/* eslint-env jest */
import R from 'ramda'

import crudReducer, { configureCRUDMerger } from '~/src/crud-reducer'

const actionType = 'action.type'
const defaultResponseState = { name: '', email: '' }
const defaultState = {
  isFetching: false,
  timestamp: null,
  data: defaultResponseState
}

describe('crudReducer', () => {
  const reducer = crudReducer(actionType, defaultResponseState)
  const state = { name: 'Tom Jones', email: 'tommy@welsh.singers' }

  it('embeds default response state in a CRUD-friendly structure', () => {
    const action = { type: actionType }
    expect(reducer(null, action)).toEqual(defaultState)
  })

  describe('when action type matches', () => {
    it('returns mutated state', () => {
      const action = { type: actionType, data: { name: 'Charlotte Church' } }
      expect(reducer(state, action).data.name).toEqual('Charlotte Church')
    })
  })

  describe('when action type does not match', () => {
    it('returns the given state', () => {
      const action = { type: 'different.action', data: { name: 'Charlotte Church' } }
      expect(reducer(state, action)).toEqual(defaultState)
    })
  })
})

describe('configureCRUDMerger', () => {
  const merger = configureCRUDMerger(defaultState)

  it('only merges keys in the default state', () => {
    const newState = merger({ some: 'state' }, { type: actionType, isFetching: true, key: 'blah' })

    const sortKeys = R.pipe(
      R.keys,
      R.sort((lhs, rhs) => lhs < rhs)
    )

    expect(sortKeys(newState)).toEqual(sortKeys(defaultState))
    expect(newState.isFetching).toBe(true)
  })

  it('merges response state under the "data" key', () => {
    const newState = merger(null, { type: actionType, isFetching: false, data: { name: 'Jones' } })
    expect(newState.data.name).toEqual('Jones')
  })

  it('does not merge keys if they are not present on the action', () => {
    const newState = merger({ some: 'state' }, { type: actionType, isFetching: true })
    expect(newState).toMatchObject({ data: { name: '' } })
  })
})
