// @flow
import { combineReducers } from 'redux'

import {
  makeActionType,
  type ActionType
} from '~/src/action'
import crudReducer from '~/src/crud/reducer'

import { type Reducer } from '~/src/reducer'

const resourceReducer =
  (resourceName: ActionType, defaultResourceState: Object): Reducer =>
  combineReducers({
    'index': crudReducer([], makeActionType(resourceName, 'index')),
    'new': crudReducer(defaultResourceState, makeActionType(resourceName, 'new')),
    'create': crudReducer(defaultResourceState, makeActionType(resourceName, 'create')),
    'update': crudReducer(defaultResourceState, makeActionType(resourceName, 'update')),
    'destroy': crudReducer(defaultResourceState, makeActionType(resourceName, 'destroy'))
  })

export default resourceReducer
