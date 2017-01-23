/* eslint-env jest */
import R from 'ramda'

import { crudReducer } from '~/src/crud'

const defaultResponseState = { name: '', email: '' }
const defaultState = {
  isFetching: false,
  timestamp: null,
  data: defaultResponseState
}

const actionData = { data: { actionData: 'action-data' } }
const actionType = 'action.type'
// const action = R.merge(actionData, { type: actionType })

describe('crudReducer', () => {
  const reducer = crudReducer(actionType, defaultResponseState)

  it('embeds default response state in a CRUD-friendly structure', () => {
    const action = { type: actionType }
    expect(reducer(null, action)).toEqual(defaultState)
  })
})
