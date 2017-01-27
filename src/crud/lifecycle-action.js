// @flow
import R from 'ramda'

import { makeActionType, type ActionType } from '~/src/action'
import { type State } from '~/src/reducer'

export type LifecycleActionCreator = (options?: { data?: Object, error?: Object }) => State
export type LifecycleState = 'request' | 'success' | 'failure'
export type LifecycleActions = { [key: LifecycleState]: LifecycleActionCreator }

export const inFlightStatusKey = 'isFetching'

const lifecycleAction =
  (type: ActionType, state: LifecycleState, inFlight: Boolean): LifecycleActionCreator =>
  ({ data, error } = {}): State =>
  R.pipe(
    R.when(
      R.always(R.not(R.isNil(data))),
      R.merge({ data }),
    ),
    R.when(
      R.always(R.not(R.isNil(error))),
      R.merge({ error })
    )
  )({
    timestamp: Date.now(),
    type: makeActionType(type, state),
    [inFlightStatusKey]: inFlight
  })

export default R.curry(lifecycleAction)
