// @flow
import R from 'ramda'

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

const crudReducer = (actionType: ActionType, defaultResponseState: State): Reducer => {
  const defaultState = defaultCRUDState(defaultResponseState)

  return R.pipe(
    R.always(configureCRUDMerger(defaultState)),
    configureReducer(defaultState, actionType)
  )(actionType, defaultResponseState)
}

export default crudReducer
