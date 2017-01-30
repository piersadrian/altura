/* eslint-env jest */

import endpointAction from '~/src/crud/action'
import {
  expectDispatchedAction,
  mockDispatch
} from '~/test/__helpers__/redux'

const endpointName = 'index'
const getState = () => ({
  [endpointName]: {
    isFetching: false,
    timestamp: Date.now(),
    data: null,
    error: null
  }
})

const dispatch = mockDispatch((action) => typeof action === 'function' ? action(dispatch, getState) : action)

describe('action', () => {
  describe('on successful response', () => {
    it('dispatches the right lifecycle actions', () => {
      const requestAction = endpointAction(endpointName, () => Promise.resolve())
      return dispatch(requestAction()).then(() => {
        expectDispatchedAction(dispatch, { type: 'index.request', isFetching: true })
        expectDispatchedAction(dispatch, { type: 'index.success', isFetching: false })
      })
    })
  })

  describe('on failed response', () => {
    it('dispatches the right lifecycle actions', () => {
      const requestAction = endpointAction(endpointName, () => Promise.reject())
      return dispatch(requestAction()).then(() => {
        expectDispatchedAction(dispatch, { type: 'index.request', isFetching: true })
        expectDispatchedAction(dispatch, { type: 'index.failure', isFetching: false })
      })
    })
  })
})
