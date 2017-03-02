// @flow
import R from 'ramda'

import {
  makeActionType,
  type Action,
  type ActionType
} from '~/src/action'

import { inFlightStatusKey } from '~/src/network/lifecycle-action'
import reducer, {
  mergeReducers,
  type Reducer,
  type State
} from '~/src/reducer'

export const defaultEndpointState = (defaultResponseState: State) => ({
  [inFlightStatusKey]: false,
  timestamp: null,
  data: defaultResponseState,
  error: null
})

export const endpointMerger =
  (defaultState: State): Reducer =>
  (state: State, action: Action): State =>
  R.pipe(
    R.always(R.keys(defaultState)),
    R.filter(R.has),
    R.pick(R.__, action),
    R.merge(defaultState),
  )(action)

const endpointReducer =
  (defaultResponseState: State, actionType: ActionType): Reducer =>
  R.pipe(
    defaultEndpointState,
    (defaultState) => reducer(defaultState, endpointMerger(defaultState)),
    R.map(R.__, [
      makeActionType(actionType, 'request'),
      makeActionType(actionType, 'success'),
      makeActionType(actionType, 'failure')
    ]),
    mergeReducers
  )(defaultResponseState)

export default R.curry(endpointReducer)
