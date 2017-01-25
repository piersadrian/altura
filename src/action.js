// @flow
import R from 'ramda'

export type ActionType = string
export type Action = {
  type: ActionType,
  data: mixed
}

export const STATE_PATH_SEPARATOR = '.'

export const makeActionType =
  (...types: Array<ActionType>): ActionType => R.join(STATE_PATH_SEPARATOR, types)

export const makeActionPath =
  (type: ActionType): Array<ActionType> => R.split(STATE_PATH_SEPARATOR, type)

export const configureDataAction =
  (type: ActionType) =>
  (data: Object) => ({
    timestamp: Date.now(),
    type,
    data
  })
