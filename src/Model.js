'use strict'

import _ from 'lodash'
import BaseModel from './BaseModel'

export default class Model extends BaseModel {

  constructor(state = null) {
    super()

    const attrs = this.constructor.attributes

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

  // Instance Methods

  get(attr, type) {
    return this.state[attr]
  }

  set(attr, val) {
    this.state[attr] = val
    return this
  }

  // toJSON
  toJSON({ only, except } = { only: null, except: null }) {
    let attrs = this.attributes

    if (only && Array.isArray(only)) {
      attrs = _.intersection(attrs, only)
    } else if (except && Array.isArray(except)) {
      attrs = _.without(attrs, ...except)
    }

    return _.pick(
      this.state,
      attrs
    )
  }

  // Helper for console.log
  inspect(options) {
    return this.toJSON(options)
  }

  // CRUD FOR THEINSTANCE

  /**
   * Saves an instance
   *
   * @example
   *
   *    user.set('name', 'r2d2')
   *    user.save()
   *
   * @return {Promise}
   */
  save() {
    const id = this.get('id') || this.get('_id')
    const action = id ? 'update' : 'create'
    return this.constructor[action](this)
  }

  /**
   * Deletes a instance
   *
   * @example
   *
   *    user.delete()
   *
   * @param {Object} attributes
   * @return {Promise}
   */
  delete() {
    const id = this.get('id') || this.get('_id')
    return this.constructor.destroy(id)
  }

  validate() {
    return this.constructor.validate(this.toJSON())
  }

}
