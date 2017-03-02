// @flow
import R from 'ramda'

import {
  makeActionType,
  type Action,
  type ActionType
} from '~/src/action'

import reducer, {
  mergeReducers,
  type State
} from '~/src/reducer'

export const TYPES = {
  add: 'add',
  remove: 'remove'
}

export const addSingularResource =
  (state: State, action: Action) =>
  R.pipe(
    R.pick(['data']),
    R.merge(state)
  )(action)

export const removeSingularResource =
  (state: State, action: Action) =>
  R.assoc('data', null, state)

export const addPluralResource =
  (key: string) =>
  (state: State, action: Action) =>
  R.pipe(
    R.path(['data', key]),
    R.assoc(R.__, action.data, state.data),
    R.assoc('data', R.__, state)
  )(action)

export const removePluralResource =
  (key: string) =>
  (state: State, action: Action) =>
  R.pipe(
    R.path(['data', key]),
    R.dissoc(R.__, state.data),
    R.assoc('data', R.__, state)
  )(action)

export const singularReducer = R.curry(
  (actionType: ActionType, defaultState: State) =>
  mergeReducers([
    reducer(defaultState, addSingularResource, makeActionType(actionType, TYPES.add)),
    reducer(defaultState, removeSingularResource, makeActionType(actionType, TYPES.remove))
  ])
)

export const pluralReducer = R.curry(
  (actionType: ActionType, defaultState: State, key: string) =>
  mergeReducers([
    reducer(defaultState, addPluralResource(key), makeActionType(actionType, TYPES.add)),
    reducer(defaultState, removePluralResource(key), makeActionType(actionType, TYPES.remove))
  ])
)
