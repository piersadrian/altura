/* eslint-env jest */

import lifecycleAction from '~/src/crud/lifecycle-action'
import requestAction from '~/src/crud/request-action'
import {
  expectDispatchedAction,
  mockDispatch
} from '~/test/__helpers__/redux'

const dispatch = mockDispatch()
const actionType = 'actiontype'
const lifecycleActions = {
  request: jest.fn(lifecycleAction(actionType, 'request', true)),
  success: jest.fn(lifecycleAction(actionType, 'success', false)),
  failure: jest.fn(lifecycleAction(actionType, 'failure', false))
}

describe('requestAction', () => {
  const handler = jest.fn(() => Promise.resolve())
  const actionCreator = requestAction(actionType, handler, lifecycleActions)()
  const getState = () => ({
    [actionType]: {
      isFetching: false,
      timestamp: Date.now(),
      data: null,
      error: null
    }
  })

  it('always dispatches the start-request handler', () => {
    actionCreator(dispatch, getState)
    expect(lifecycleActions.request).toHaveBeenCalled()
    expectDispatchedAction(dispatch, { isFetching: true })
  })

  it('always passes getState to the request handler', () => {
    const actionCreator = requestAction(actionType, handler, lifecycleActions)()
    actionCreator(dispatch, getState)
    expect(handler).toHaveBeenCalledWith(null, getState)
  })

  it('passes getBody to the request handler, if given', () => {
    const getBody = () => ({ some: 'state' })
    const actionCreator = requestAction(actionType, handler, lifecycleActions)(getBody)

    actionCreator(dispatch, getState)
    expect(handler).toHaveBeenCalledWith(getBody, getState)
  })

  describe('when the request succeeds', () => {
    const responseData = { firstName: 'Jonas' }
    const handler = (getBody, getState) => Promise.resolve(responseData)
    const actionCreator = requestAction(actionType, handler, lifecycleActions)()

    it('dispatches the success handler', () => {
      actionCreator(dispatch, getState)
      .then((val) => {
        expect(lifecycleActions.success).toHaveBeenCalled()
        expectDispatchedAction(dispatch, { isFetching: false, data: responseData })
      })
    })
  })

  describe('when the request fails', () => {
    const error = new Error({ some: 'error' })
    const handler = (getBody, getState) => Promise.reject(error)
    const actionCreator = requestAction(actionType, handler, lifecycleActions)()

    it('dispatches the success handler', () => {
      actionCreator(dispatch, getState)
      .then(() => {
        expect(lifecycleActions.failure).toHaveBeenCalled()
        expectDispatchedAction(dispatch, { isFetching: false, error: error })
      })
    })
  })
})
