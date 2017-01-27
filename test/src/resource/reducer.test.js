/* eslint-env jest */

import resourceReducer from '~/src/resource/reducer'

describe('resourceReducer', () => {
  const reducer = resourceReducer('document', { title: '', body: '' })
  const matchingAction = { type: 'document.destroy.request', isFetching: true }

  it('populates default state for all endpoints', () => {
    const result = reducer({}, {})
    expect(result.destroy.isFetching).toBe(false)
    expect(result.destroy.data).toMatchObject({
      title: '',
      body: ''
    })
  })

  it('uses an empty array for the index endpoint', () => {
    const result = reducer({}, {})
    expect(result.index.data).toEqual([])
  })

  it('produces a combined reducer for a resource type', () => {
    const result = reducer({}, matchingAction)
    expect(result.destroy.isFetching).toBe(true)
  })
})
