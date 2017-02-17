// @flow
import R from 'ramda'

import { dataAction } from '~/src/action'

export type ResourceDefinition = { name: string, singular?: boolean, key?: string }

const resourceActions =
  (definitions: Array<ResourceDefinition>) =>
  R.reduce(
    (map, definition) => R.assoc(definition.name, dataAction(definition.name), map),
    {}
  )(definitions)

export default resourceActions
