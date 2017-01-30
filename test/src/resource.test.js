/* eslint-env jest */
import R from 'ramda'
import { combineReducers } from 'redux'

import { resource, action } from '~/src/resource'
import {
  expectDispatchedAction,
  mockDispatch
} from '~/test/__helpers__/redux'

const item = { title: 'Some Title', body: 'body content' }
const index = (buildUrl) => (context, getState) => Promise.resolve([item])
const show = (buildUrl) => (context, getState) => Promise.resolve(item)

const documentIndexHandler = jest.fn(index(() => '/documents'))
const documentShowHandler = jest.fn(show(({ id }) => `/documents/${id}`))

const { actions, reducers } = R.pipe(
  resource('document', [
    action('index', [], documentIndexHandler),
    action('show', { title: '', body: '' }, documentShowHandler)
  ])
)({})

const reducer = combineReducers(reducers)

describe('configureResources', () => {
  describe('actions', () => {
    const state = reducer({}, { type: 'INIT' })
    const getState = () => state
    const dispatch = mockDispatch((action) => {
      const actionValue = typeof action === 'function' ? action(dispatch, getState) : action
      reducer(state, actionValue)
      return actionValue
    })

    describe('on success', () => {
      it('merge response objects', () => {
        return dispatch(actions.document.show({ id: 2 }))
        .then(() => {
          expect(documentShowHandler).toHaveBeenCalledWith({ id: 2 }, getState)
          expectDispatchedAction(dispatch, { type: 'document.show.success', data: item })
        })
      })

      it('merge a response collection', () => {
        return dispatch(actions.document.index())
        .then(() => {
          expect(documentIndexHandler).toHaveBeenCalledWith(undefined, getState)
          expectDispatchedAction(dispatch, { type: 'document.index.success', data: [item] })
        })
      })
    })
  })

  describe('reducer', () => {
    it('produces a combined reducer', () => {
      expect(reducer({}, { type: 'INIT' })).toMatchObject({
        document: {
          index: {
            isFetching: false
          },
          show: {
            isFetching: false
          }
        }
      })
    })
  })
})
