// @flow
import R from 'ramda'

import { makeActionPath, type ActionType } from '~/src/action'
import { type State } from '~/src/reducer'
import { type LifecycleActions } from '~/src/crud/lifecycle-action'

export type CRUDAction = {
  type: ActionType,
  isFetching: boolean,
  data: mixed,
  error: mixed
}

export type GetState = () => State
export type GetRequestBody = (getState: GetState) => Object
export type RequestHandler = (getBody: ?GetRequestBody, getState: GetState) => Promise<State>
export type RequestActionCreator =
  (getBody: GetRequestBody) => (dispatch: Function, getState: Function) => Promise<State>

const requestAction =
  (type: ActionType, handler: RequestHandler, actions: LifecycleActions): RequestActionCreator =>
  (getBody: ?GetRequestBody = null) =>
  (dispatch: Function, getState: Function): Promise<State> =>
  R.ifElse(
    R.pipe(
      R.always(R.path(makeActionPath(type), getState())),
      R.propEq('isFetching', false),
    ),
    R.pipe(
      R.tap(R.always(dispatch(actions.request()))),
      R.curryN(2, handler)(R.__, getState),
      (promise) => promise
        .then((data: Object) => dispatch(actions.success({ data })))
        .catch((error: Object) => dispatch(actions.failure({ error })))
    ),
    R.always(Promise.resolve())
  )(getBody)

export default R.curry(requestAction)
