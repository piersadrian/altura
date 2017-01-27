// @flow
import R from 'ramda'

import {
  makeActionType,
  type Action,
  type ActionType
} from '~/src/action'

import { inFlightStatusKey } from '~/src/crud/lifecycle-action'
import configureReducer, {
  type Reducer,
  type State
} from '~/src/reducer'

export const defaultCRUDState = (defaultResponseState: State) => ({
  [inFlightStatusKey]: false,
  timestamp: null,
  data: defaultResponseState,
  error: null
})

export const configureCRUDMerger =
  (defaultState: State): Reducer =>
  (state: State, action: Action): State =>
  R.pipe(
    R.always(R.keys(defaultState)),
    R.filter(R.has),
    R.pick(R.__, action),
    R.merge(defaultState),
  )(action)

const buildCombinedReducer =
  (defaultState: State, actionTypes: Array<ActionType>): Reducer =>
  (state: State, action: Action) =>
  R.reduce(
    (state, reducer) => reducer(state, action),
    state,
    R.map(configureReducer(defaultState, R.__, configureCRUDMerger(defaultState)), actionTypes)
  )

const crudReducer =
  (defaultResponseState: State, actionType: ActionType): Reducer =>
  R.pipe(
    defaultCRUDState,
    R.curry(buildCombinedReducer)(R.__, [
      makeActionType(actionType, 'request'),
      makeActionType(actionType, 'success'),
      makeActionType(actionType, 'failure')
    ])
  )(defaultResponseState)

export default R.curry(crudReducer)
