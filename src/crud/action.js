// @flow

import R from 'ramda'

import lifecycleAction from '~/src/crud/lifecycle-action'
import requestAction, {
  type RequestActionCreator,
  type RequestHandler
} from '~/src/crud/request-action'

const endpointAction =
  (actionName: String, requestHandler: RequestHandler): RequestActionCreator =>
  R.pipe(
    (actionName) => ({
      request: lifecycleAction(actionName, 'request', true),
      success: lifecycleAction(actionName, 'success', false),
      failure: lifecycleAction(actionName, 'failure', false)
    }),
    requestAction(actionName, requestHandler)
  )(actionName)

export default R.curry(endpointAction)
