// @flow
// import R from 'ramda'

export type ActionType = string
export type Action = {
  type: ActionType,
  data: mixed
}

export const configureDataAction =
  (type: ActionType) =>
  (data: Object) => ({
    timestamp: Date.now(),
    type,
    data
  })
