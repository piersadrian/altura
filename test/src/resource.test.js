/* eslint-env jest */
import R from 'ramda'

import configureResources from '~/src/resource'

import {
  expectDispatchedAction,
  mockDispatch
} from '~/test/__helpers__/redux'

const resourcesConfig = {
  index: { name: 'index', path: '/api/v1/documents', method: 'get', collection: true },
  show: { name: 'show', path: (id) => `/api/v1/documents/${id}`, method: 'get' }
}

const { buildActions, buildReducer } = configureResources(R.values(resourcesConfig))
const reducer = buildReducer({ title: '', body: '' })

describe('configureResources', () => {
  it('exposes `buildActions` and `buildReducer` functions', () => {
    const resourceBuilder = configureResources(R.values(resourcesConfig))
    expect(resourceBuilder.buildActions).toBeInstanceOf(Function)
    expect(resourceBuilder.buildReducer).toBeInstanceOf(Function)
  })

  describe('actions', () => {
    let state = reducer({}, { type: 'INIT' })
    const getState = jest.fn(() => state)
    const dispatch = mockDispatch((action) => {
      const actionValue = typeof action === 'function' ? action(dispatch, getState) : action
      reducer(state, actionValue)
      return actionValue
    })

    const item = { title: 'Some Title', body: 'body content' }

    describe('on success', () => {
      it('merge response objects', () => {
        const showHandler = jest.fn((config, getState, context) => Promise.resolve(item))
        const actions = buildActions(showHandler)
        return dispatch(actions.show(2))
        .then(() => {
          const config = R.assoc('path', resourcesConfig.show.path(2), resourcesConfig.show)
          expect(showHandler).toHaveBeenCalledWith(config, getState, 2)
          expectDispatchedAction(dispatch, { type: 'show.success', data: item })
        })
      })

      it('merge a response collection', () => {
        const indexHandler = jest.fn((config, getState, context) => Promise.resolve([item]))
        const actions = buildActions(indexHandler)
        return dispatch(actions.index())
        .then(() => {
          expect(indexHandler).toHaveBeenCalledWith(resourcesConfig.index, getState)
          expectDispatchedAction(dispatch, { type: 'index.success', data: [item] })
        })
      })
    })
  })

  describe('reducer', () => {
    it('produces a combined reducer', () => {
      expect(reducer({}, { type: 'INIT' })).toMatchObject({
        index: {
          isFetching: false
        },
        show: {
          isFetching: false
        }
      })
    })
  })
})
