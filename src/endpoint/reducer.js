// @flow
import R from 'ramda'

import {
  makeActionType,
  type Action,
  type ActionType
} from '~/src/action'

import { inFlightStatusKey } from '~/src/network/lifecycle-action'
import reducer, {
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

export const buildCombinedReducer =
  (defaultState: State, actionTypes: Array<ActionType>): Reducer =>
  (state: State, action: Action) =>
  R.pipe(
    R.map(reducer(defaultState, R.__, endpointMerger(defaultState))),
    R.reduce(
      (state, reducer) => reducer(state, action),
      state
    )
  )(actionTypes)

const endpointReducer =
  (defaultResponseState: State, actionType: ActionType): Reducer =>
  R.pipe(
    defaultEndpointState,
    R.curry(buildCombinedReducer)(R.__, [
      makeActionType(actionType, 'request'),
      makeActionType(actionType, 'success'),
      makeActionType(actionType, 'failure')
    ])
  )(defaultResponseState)

export default R.curry(endpointReducer)
