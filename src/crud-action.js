// @flow
import R from 'ramda'

import {
  type ActionType
} from '~/src/action'

export type CRUDLifecycleState =
  'request' |
  'success' |
  'failure'

export type CRUDAction = {
  type: ActionType,
  isFetching: Boolean,
  data: mixed,
  error: mixed
}

export const requestLifecycleAction =
  (actionType: ActionType, lifecycleState: CRUDLifecycleState) =>
  (isFetching: Boolean, data: ?Object, error: ?Object) => ({
    timestamp: Date.now(),
    type: R.join('.', actionType, lifecycleState),
    isFetching,
    data,
    error
  })

export const requestAction =
  (actionType: ActionType) => {}
