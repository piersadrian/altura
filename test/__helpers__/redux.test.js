/* eslint-env jest */
// @flow

import R from 'ramda'

import { pickCallProps } from '~/test/__helpers__/redux'

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
