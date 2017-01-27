// @flow
import R from 'ramda'
import { combineReducers } from 'redux'

import {
  makeActionType,
  type Action,
  type ActionType
} from '~/src/action'

import configureReducer, {
  type Reducer,
  type State
} from '~/src/reducer'

export const defaultCRUDState = (defaultResponseState: State) => ({
  isFetching: false,
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

const buildReducer =
  (defaultState: State, actionType: ActionType) =>
  configureReducer(defaultState, actionType, configureCRUDMerger(defaultState))

const crudReducer =
  (defaultResponseState: State, actionType: ActionType): Reducer =>
  R.pipe(
    defaultCRUDState,
    (defaultState) => ({
      request: buildReducer(defaultState, makeActionType(actionType, 'request')),
      success: buildReducer(defaultState, makeActionType(actionType, 'success')),
      failure: buildReducer(defaultState, makeActionType(actionType, 'failure'))
    }),
    combineReducers
  )(defaultResponseState)

export default R.curry(crudReducer)
