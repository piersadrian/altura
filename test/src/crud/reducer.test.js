/* eslint-env jest */

import crudReducer, {
  configureCRUDMerger,
  defaultCRUDState
} from '~/src/crud/reducer'

const defaultResponseState = { name: '', email: '' }

describe('crudReducer', () => {
  const reducer = crudReducer(defaultResponseState, 'index')
  const state = { name: 'Tom Jones', email: 'tommy@welsh.singers' }

  it('embeds default response state in a CRUD-friendly structure', () => {
    const previousState = defaultCRUDState(defaultResponseState)
    const action = { type: 'request' }
    expect(reducer(previousState, action)).toEqual(previousState)
  })

  describe('when action type matches', () => {
    it('returns mutated state', () => {
      const previousState = defaultCRUDState(state)
      const action = { type: 'index.success', data: { name: 'Charlotte Church' } }
      expect(reducer(previousState, action).data).toEqual(action.data)
    })
  })

  describe('when action type does not match', () => {
    it('returns the given state', () => {
      const previousState = defaultCRUDState(state)
      const action = { type: 'otherAction', data: { name: 'Charlotte Church' } }
      expect(reducer(previousState, action)).toEqual(previousState)
    })
  })
})

describe('configureCRUDMerger', () => {
  const merger = configureCRUDMerger(defaultCRUDState(defaultResponseState))

  it('only merges keys in the default state', () => {
    const newState = merger({ some: 'state' }, { type: 'some-action', isFetching: true, nope: 'blah' })
    expect(newState.isFetching).toBe(true)
    expect(newState.nope).toBeUndefined()
  })

  it('merges response state under the "data" key', () => {
    const newState = merger(
      { data: { name: 'Smith' } },
      { type: 'some-action', isFetching: false, data: { name: 'Jones' } }
    )
    expect(newState.data.name).toEqual('Jones')
  })

  it('does not merge keys if they are not present on the action', () => {
    const newState = merger({ some: 'state' }, { type: 'some-action', isFetching: true })
    expect(newState).toMatchObject({ isFetching: true, data: { name: '' } })
  })
})
