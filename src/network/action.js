// @flow
import R from 'ramda'

import { makeActionPath, type ActionType } from '~/src/action'
import { type State } from '~/src/reducer'
import {
  inFlightStatusKey,
  type LifecycleActions
} from '~/src/network/lifecycle-action'

export type CRUDAction = {
  type: ActionType,
  isFetching: boolean,
  data: mixed,
  error: mixed
}

export type GetState = () => State
export type RequestHandler = (context: mixed, getState: GetState) => Promise<State>
export type ThunkActionCreator = (dispatch: Function, getState: GetState) => Promise<State>
export type NetworkActionCreator = (...context: Array<mixed>) => ThunkActionCreator

const checkPromise = (handlerValue) => {
  if (!R.is(Promise, handlerValue)) {
    throw new Error('request handler must return a Promise')
  }
}

const networkAction =
  (type: ActionType, handler: RequestHandler, actions: LifecycleActions): NetworkActionCreator =>
  (context: mixed) =>
  (dispatch: Function, getState: Function): Promise<State> =>
  R.ifElse(
    R.pipe(
      R.always(R.path(makeActionPath(type), getState())),
      R.propEq(inFlightStatusKey, false),
    ),
    R.pipe(
      R.tap(R.always(dispatch(actions.request()))),
      R.curryN(2, handler)(R.__, getState),
      R.tap(checkPromise),
      (promise) => promise
        .then((data: Object) => dispatch(actions.success({ data })))
        .catch((error: Object) => dispatch(actions.failure({ error })))
    ),
    R.always(Promise.resolve())
  )(context)

export default R.curry(networkAction)
