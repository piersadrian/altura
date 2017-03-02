/* eslint-env jest */
import {
  singularReducer,
  pluralReducer,

  addSingularResource,
  removeSingularResource,
  addPluralResource,
  removePluralResource
} from '~/src/resource/reducer'

describe('resource reducers', () => {
  const data = { id: 252, name: 'some name' }

  describe('singular', () => {
    const reducer = singularReducer('document', { name: '' })

    it('adds a singular resource', () => {
      expect(reducer({}, { type: 'document.add', data })).toEqual({ data })
    })

    it('removes a singular resource', () => {
      expect(reducer({ data }, { type: 'document.remove' })).toEqual({ data: null })
    })
  })

  describe('plural', () => {
    const reducer = pluralReducer('document', { name: '' }, 'id')

    it('adds a plural resource', () => {
      expect(reducer({}, { type: 'document.add', data })).toEqual({ data: { '252': data } })
    })

    it('removes a plural resource', () => {
      const state = {
        data: {
          '101': { id: 101, name: 'do not delete' },
          '252': data
        }
      }

      const newState = {
        data: {
          '101': { id: 101, name: 'do not delete' }
        }
      }

      expect(reducer(state, { type: 'document.remove', data: { id: 252 } })).toEqual(newState)
    })
  })
})

describe('resource mergers', () => {
  const action = { data: { id: 233, name: 'some name' } }

  describe('singular', () => {
    it('adds', () => {
      expect(addSingularResource({}, action)).toEqual({ data: action.data })
    })

    it('removes regardless of any action data', () => {
      expect(removeSingularResource({ data: action.data }, { id: 233 })).toEqual({ data: null })
      expect(removeSingularResource({ data: action.data }, {})).toEqual({ data: null })
    })
  })

  describe('plural', () => {
    it('adds', () => {
      const merger = addPluralResource('id')
      expect(merger({}, action)).toEqual({ data: { '233': action.data } })
    })

    it('removes when passed a key for lookup', () => {
      const merger = removePluralResource('id')
      const state = { data: { '233': action.data } }
      expect(merger(state, { data: { id: 233 } })).toEqual({ data: {} })
    })

    it('does not remove when given key is not found', () => {
      const merger = removePluralResource('id')
      const state = { data: { '233': action.data } }
      expect(merger(state, { data: { id: 235 } })).toEqual(state)
    })
  })
})

// const state = {}
// console.log(reducer(state, { type: 'document.add', data: { id: 6, name: 'john' } }))
