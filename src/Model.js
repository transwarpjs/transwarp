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
   * @return {Promise}
   */
  save() {
    //return
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
