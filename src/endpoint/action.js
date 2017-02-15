// @flow

import R from 'ramda'

import { type ActionType } from '~/src/action'
import lifecycleAction from '~/src/network/lifecycle-action'
import requestAction, {
  type NetworkActionCreator,
  type RequestHandler
} from '~/src/network/action'

const endpointAction =
  (actionType: ActionType,
  requestHandler: RequestHandler): NetworkActionCreator =>
  R.pipe(
    (actionType) => ({
      request: lifecycleAction(actionType, 'request', true),
      success: lifecycleAction(actionType, 'success', false),
      failure: lifecycleAction(actionType, 'failure', false)
    }),
    requestAction(actionType, requestHandler)
  )(actionType)

export default R.curry(endpointAction)
