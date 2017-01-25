// @flow
import R from 'ramda'

import { makeActionType, type ActionType } from '~/src/action'
import { type State } from '~/src/reducer'

export type LifecycleActionCreator = (data: ?Object, error: ?Object) => State
export type LifecycleState = 'request' | 'success' | 'failure'
export type LifecycleActions = { [key: LifecycleState]: LifecycleActionCreator }

const lifecycleAction =
  (type: ActionType, state: LifecycleState, isFetching: Boolean): LifecycleActionCreator =>
  (data: ?Object = null, error: ?Object = null): State => ({
    timestamp: Date.now(),
    type: makeActionType(type, state),
    isFetching,
    data,
    error
  })

export default R.curry(lifecycleAction)
