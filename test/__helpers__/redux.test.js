/* eslint-env jest */
// @flow

import R from 'ramda'

import {
  expectDispatchedAction,
  pickCallProps
} from '~/test/__helpers__/redux'

describe('expectDispatchedAction', () => {
  it('matches against a mock\'s calls by the given shape', () => {
    const fn = jest.fn()
    fn({ first: 'first', second: 'second' })
    fn({ second: 'second', third: 'third' })

    expectDispatchedAction(fn, { second: 'second' })
  })
})

describe('pickCallProps', () => {
  it('selects only the given props', () => {
    const fn = jest.fn()
    fn({ exclude: 'this-arg', include: 'this-arg' })
    fn({ also: 'exclude-this-arg', include: 'this-arg' })
    fn({ andFinally: 'exclude-this-arg-too', include: 'this-arg' })

    const result = pickCallProps(fn, ['include'])

    expect(result.length).toBe(3)

    R.forEach(
      R.pipe(
        R.head,
        R.tap((obj) => expect(obj).toEqual({ include: 'this-arg' }))
      )
    )(result)
  })
})
