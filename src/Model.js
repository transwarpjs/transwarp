import _ from 'lodash'
import BaseModel from './BaseModel'

export default class Model extends BaseModel {

  constructor(state = null) {
    super()

    const attrs = this.ctor.attributes

    this.state = _.pick(
      state,
      ...attrs
    )
  }

  // Shorthand for the Model Constructor
  get ctor() {
    return this.constructor
  }

  get attributes() {
    return this.ctor.attributes
  }

  get type() {
    return this.ctor.name
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
    return this.ctor.update(this)
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
  delete() {}

  validate() {}

}
