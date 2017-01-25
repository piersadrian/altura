// @flow
import R from 'ramda'

import {
  type Action,
  type ActionType
} from '~/src/action'

export type State = { [key: string]: mixed }
export type Reducer = (state: State, action: Action) => State

const throwIfNoStateObject = R.ifElse(
  R.either(
    R.isNil,
    R.is(Function),
  ),
  (value) => {
    throw new Error(`reducer fuction returned a ${typeof value}; should return a state object`)
  },
  R.identity
)

const configureReducer =
  (defaultState: State, actionType: ActionType, merger: Reducer): Reducer =>
  (state: State, action: Action): State =>
  R.ifElse(
    R.propEq('type', actionType),
    R.pipe(
      R.curry(merger)(R.defaultTo(defaultState, state)),
      throwIfNoStateObject
    ),
    R.always(defaultState)
  )(action)

export default R.curry(configureReducer)
