// @flow
import R from 'ramda'
import { combineReducers } from 'redux'

import {
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
    R.merge(defaultState)
  )(action)

const makeReducerMap = R.curry(
  (actionTypes: Array<ActionType>, state: State) =>
  R.reduce(
    (actions, actionType) =>
      R.assoc(
        actionType,
        configureReducer(state, actionType, configureCRUDMerger(state)),
        actions
      ),
    {},
    actionTypes
  )
)

const crudReducer =
  (defaultResponseState: State): Reducer =>
  R.pipe(
    defaultCRUDState,
    makeReducerMap(['request', 'success', 'failure']),
    combineReducers
  )(defaultResponseState)

export default R.curry(crudReducer)
