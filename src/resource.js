// @flow

import R from 'ramda'
import { combineReducers } from 'redux'

import endpointAction from '~/src/crud/action'
import crudReducer from '~/src/crud/reducer'

import {
  type RequestActionCreator,
  type RequestHandler
} from '~/src/crud/request-action'

import {
  type Reducer,
  type State
} from '~/src/reducer'

import { makeActionType } from '~/src/action'

export type ResourceConfig = {|
  name: string,
  path: string | Function,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options',
|}

type ActionDefinition = {| name: string, defaultState: State, handler: RequestHandler |}
type ActionMap = { [key: string]: RequestActionCreator }
type ReducerMap = { [key: string]: Reducer }
type Resources = {|
  actions: ActionMap,
  reducers: ReducerMap
|}

const buildActions =
  (resourceName: string,
  definitions: Array<ActionDefinition>): ActionMap =>
  R.reduce(
    (object, definition) => R.assoc(
      definition.name,
      endpointAction(makeActionType(resourceName, definition.name), definition.handler),
      object
    ),
    {}
  )(definitions)

const buildReducer =
  (resourceName: string,
  definitions: Array<ActionDefinition>): Reducer =>
  R.pipe(
    R.reduce(
      (object, definition) => R.assoc(
        definition.name,
        crudReducer(definition.defaultState, makeActionType(resourceName, definition.name)),
        object
      ),
      {}
    ),
    combineReducers
  )(definitions)

export const resource = R.curry(
  (name: string,
  definitions: Array<ActionDefinition>,
  resources: Resources): Resources =>
  R.pipe(
    R.assocPath(['actions', name], buildActions(name, definitions)),
    R.assocPath(['reducers', name], buildReducer(name, definitions))
  )(resources)
)

export const action = R.curry(
  (name: string,
  defaultState: State,
  handler: RequestHandler): ActionDefinition => ({
    name,
    defaultState,
    handler
  })
)
