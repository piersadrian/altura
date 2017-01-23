// @flow
import R from 'ramda'

import { configureReducer } from '~/src/reducer'
import type { State } from '~/src/reducer'

// type Condition = (state: Object, action: Action) => Boolean

const defaultCRUDState = (defaultResponseState: State) => ({
  isFetching: false,
  timestamp: null,
  data: defaultResponseState
})

const crudReducer = (actionType: string, defaultResponseState: State) => {
  const defaultState = defaultCRUDState(defaultResponseState)
  const makeCRUDReducer = configureReducer(defaultState)

  return makeCRUDReducer(actionType, (state, action) =>
    R.merge(state, R.pick(R.keys(defaultState), action)))
}

export {
  crudReducer
}
