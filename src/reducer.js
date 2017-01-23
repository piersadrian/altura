// @flow
import R from 'ramda'

// const buildReducer = (states, defaultState) => (state = defaultState, action) => {
//   if (action.type === states.REQUEST) {
//     return R.merge(state, {
//       isFetching: true
//     })
//   } else if (action.type === states.SUCCESS) {
//     return R.merge(state, {
//       isFetching: false,
//       data: action.data
//     })
//   } else if (action.type === states.FAILURE) {
//     return R.merge(state, {
//       isFetching: false,
//       error: action.error
//     })
//   } else {
//     return state
//   }
// }

export type Reducer = (state: Object, action: Action) => Object
export type State = { [key: string]: mixed }
export type ActionType = string
export type Action = {
  type: ActionType,
  data: Object
}

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
    R.curry(merger)(R.defaultTo(defaultState, state)),
    R.always(defaultState)
  )(action)

export default R.curry(configureReducer)
