// @flow
import R from 'ramda'

import {
  type Action,
  type ActionType
} from '~/src/action'

export type State = { [key: string]: mixed }
export type Reducer = (state: State, action: Action) => State

const throwIfNoStateObject = R.when(
  R.either(R.isNil, (value) => typeof value !== 'object'),
  (value) => { throw new Error(`reducer returned a ${typeof value}; should return an object`) }
)

export const mergeReducers =
  (reducers: Array<Reducer>) =>
  (state: State, action: Action) =>
  R.reduce(
    (state, reducer) => reducer(state, action),
    state
  )(reducers)

const reducer =
  (defaultState: State, merger: Reducer, actionType: ActionType): Reducer =>
  (state: State, action: Action): State =>
  R.ifElse(
    R.pipe(
      R.propEq('type', actionType),
    ),
    R.pipe(
      R.curry(merger)(R.defaultTo(defaultState, state)),
      throwIfNoStateObject
    ),
    R.always(R.defaultTo(defaultState, state))
  )(action)

export default R.curry(reducer)
