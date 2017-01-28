// @flow

import R from 'ramda'
import { combineReducers } from 'redux'

import endpointAction from '~/src/crud/action'
import crudReducer from '~/src/crud/reducer'

import {
  type RequestActionCreator,
  type RequestHandler,
  type GetState
} from '~/src/crud/request-action'

import {
  type Reducer,
  type State
} from '~/src/reducer'

export type ResourceConfig = {|
  name: string,
  path: string | Function,
  method: 'get' | 'post' | 'put' | 'patch' | 'delete' | 'options',
|}

export type ResourceActions = { [key: string]: RequestActionCreator }
export type ResourceHandler =
  (config: ResourceConfig, getState: GetState, ...context: Array<mixed>) => Promise<State>

const requestHandler =
  (handler: ResourceHandler, config: ResourceConfig): RequestHandler =>
  (getState: GetState, ...context: Array<mixed>): Promise<State> =>
  R.pipe(
    R.when(
      R.pipe(
        R.prop('path'),
        R.is(Function)
      ),
      R.pipe(
        R.prop('path'),
        R.apply(R.__, context),
        R.assoc('path', R.__, config)
      )
    ),
    R.prepend(R.__, [getState, ...context]),
    R.apply(handler)
  )(config)

export const buildActions = R.curry(
  (configs: Array<ResourceConfig>, handler: ResourceHandler): ResourceActions =>
  R.reduce(
    (resources, config) => R.assoc(
      config.name, endpointAction(config.name, requestHandler(handler, config)), resources
    ),
    {}
  )(configs)
)

export const buildReducer = R.curry(
  (configs: Array<ResourceConfig>, defaultState: State): Reducer =>
  R.pipe(
    R.reduce(
      (reducers, config) => R.assoc(
        config.name, crudReducer(config.collection ? [] : defaultState, config.name), reducers
      ),
      {}
    ),
    combineReducers
  )(configs)
)

const configureResources =
  (configs: Array<ResourceConfig>) => ({
    buildActions: buildActions(configs),
    buildReducer: buildReducer(configs)
  })

export default configureResources
