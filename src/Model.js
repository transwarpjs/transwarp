import _ from 'lodash'
import BaseModel from './BaseModel'

export default class Model extends BaseModel {

  constructor(state = null) {
    super()

    const constructor = this.constructor

    const attrs = constructor.attributes

    this.state = _.pick(
      state,
      ...attrs
    )
  }

  get attributes() {
    return this.constructor.attributes
  }

  get type() {
    return this.constructor.name
  }

  get(attr) {
    return this.state[attr]
  }

  set(attr, val) {
    this.state[attr] = val
  }

  // options = { except: [], only: [] }
  toJSON() {
    return JSON.stringify(this.state)
  }

}
