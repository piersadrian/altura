// @flow

import R from 'ramda'

import { type Action } from '~/src/action'
import reducer, { type State } from '~/src/reducer'

const replaceSingularResource =
  (state: State, action: Action) =>
  R.pipe(
    R.pick('data'),
    R.merge(state)
  )(action)

const addPluralResource =
  (state: State, action: Action) =>
  R.pipe(
    R.prop('data'),
    R.append(R.__, state.data)
  )(action)

const removePluralResource =
  (state: State, action: Action) =>
  R.pipe(
    // { id: 233 }
    R.toPairs,
    R.head,
    // [id, 223]
    (key, value) => R.find(R.propEq(key, value), state.data),
    R.when(
      R.isNil,
    )
  )(R.prop('data', action))

const buildSingularReducer = () => {}
const buildPluralReducer = () => {}

export const buildReducer =
  (name: string, defaultState: State, singular: boolean, key: string) =>
  reducer(defaultState, name, merger)

const resourceReducer =
  (actionType) => {}

export default resourceReducer
