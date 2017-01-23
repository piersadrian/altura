// @flow
// import R from 'ramda'

const buildActionCreator = (type) => (data, error) => {
  return {
    timestamp: Date.now(),
    type,
    data,
    error
  }
}
