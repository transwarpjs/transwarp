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

  // Instance Methods

  get(attr, type) {
    return this.state[attr]
  }

  set(attr, val) {
    this.state[attr] = val
    return this
  }

  // toJSON
  // options = { except: [], only: [] }
  toJSON(options) {
    return JSON.stringify(this.state)
  }

  // toObject
  // options = { except: [], only: [] }
  toObject(options) {}

  // Helper for console.log
  // inspect
  // options = { except: [], only: [] }
  inspect(options) {}
  toString(options) {
    return this.inspect(options)
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
   * @param {Object} attributes
   * @returns {Promise}
   */
  save() {}

  /**
   * Deletes a instance
   *
   * @example
   *
   *    user.delete()
   *
   * @param {Object} attributes
   * @returns {Promise}
   */
  delete() {}
}
