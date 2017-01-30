// @flow

import R from 'ramda'

import { type ActionType } from '~/src/action'
import lifecycleAction from '~/src/crud/lifecycle-action'
import requestAction, {
  type RequestActionCreator,
  type RequestHandler
} from '~/src/crud/request-action'

const endpointAction =
  (actionType: ActionType,
  requestHandler: RequestHandler): RequestActionCreator =>
  R.pipe(
    (actionType) => ({
      request: lifecycleAction(actionType, 'request', true),
      success: lifecycleAction(actionType, 'success', false),
      failure: lifecycleAction(actionType, 'failure', false)
    }),
    requestAction(actionType, requestHandler)
  )(actionType)

export default R.curry(endpointAction)
