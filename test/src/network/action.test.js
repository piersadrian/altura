/* eslint-env jest */

import lifecycleAction from '~/src/network/lifecycle-action'
import networkAction from '~/src/network/action'
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

describe('networkAction', () => {
  const handler = jest.fn(() => Promise.resolve())
  const actionCreator = networkAction(actionType, handler, lifecycleActions)()
  const getState = () => ({
    [actionType]: {
      isFetching: false,
      timestamp: Date.now(),
      data: null,
      error: null
    }
  })

  it('always dispatches the start-request handler', () => {
    return actionCreator(dispatch, getState)
    .then(() => {
      expect(lifecycleActions.request).toHaveBeenCalled()
      expectDispatchedAction(dispatch, { isFetching: true })
    })
  })

  it('always passes getState to the request handler', () => {
    const actionCreator = networkAction(actionType, handler, lifecycleActions)()
    return actionCreator(dispatch, getState)
    .then(() => expect(handler).toHaveBeenCalledWith(undefined, getState))
  })

  it('passes context to the request handler, if given', () => {
    const context = () => ({ some: 'state' })
    const actionCreator = networkAction(actionType, handler, lifecycleActions)(context)

    return actionCreator(dispatch, getState)
    .then(() => expect(handler).toHaveBeenCalledWith(context, getState))
  })

  describe('when the request succeeds', () => {
    const responseData = { firstName: 'Jonas' }
    const handler = (getBody, getState) => Promise.resolve(responseData)
    const actionCreator = networkAction(actionType, handler, lifecycleActions)()

    it('dispatches the success handler', () => {
      return actionCreator(dispatch, getState)
      .then(() => {
        expect(lifecycleActions.success).toHaveBeenCalled()
        expectDispatchedAction(dispatch, { isFetching: false, data: responseData })
      })
    })
  })

  describe('when the request fails', () => {
    const error = new Error({ some: 'error' })
    const handler = (getBody, getState) => Promise.reject(error)
    const actionCreator = networkAction(actionType, handler, lifecycleActions)()

    it('dispatches the success handler', () => {
      const result = actionCreator(dispatch, getState)
      .then(() => {
        expect(lifecycleActions.failure).toHaveBeenCalled()
        expectDispatchedAction(dispatch, { isFetching: false, error: error })
      })

      // console.log(result)

      return result
    })
  })
})
