'use strict'

import _ from 'lodash'
import compose from 'koa-compose'
import BaseModel from './BaseModel'

export default class Model extends BaseModel {

  constructor(state = null, exists = false) {
    super()

    const attrs = this.constructor.attributes

    this.state = _.pick(
      state,
      ...attrs
    )

    this.exists = exists
  }

  get tempState() {
    return this._tempState || (this._tempState = Object.create(null))
  }

  set tempState(state) {
    this._tempState = state
  }

  get attributes() {
    return this.constructor.attributes
  }

  get type() {
    return this.constructor.name
  }

  // Shorthand for the constructor's hooks
  get hooks() {
    return this.constructor.hooks
  }

  // Instance Methods

  get(attr, type) {
    return this.state[attr]
  }

  set(attr, val, nocache) {
    if (!nocache) this.tempState[attr] = this.state[attr]
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
    const hooks = this.hooks
    const prefix = this.exists ? 'updat' : 'creat'
    let stack = hooks.listeners('saving')
    stack.push(...hooks.listeners(`${prefix}ing`))
    stack.push((_, next) => {
      return this.constructor[`${prefix}e`](this)
      .then(next)
    })
    stack.push(...hooks.listeners(`${prefix}ed`))
    stack.push(...hooks.listeners('saved'))
    return compose(stack)(this)
    /*
    const id = this.get('id') || this.get('_id')
    const action = id ? 'update' : 'create'
    return this.constructor[action](this)
    */
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
    const hooks = this.hooks
    let stack = hooks.listeners('deleting')
    stack.push((_, next) => {
      const id = this.get('id') || this.get('_id')
      return this.constructor.destroy(id).then(() => {
        this.exists = false
        return next()
      })
    })
    stack.push(...hooks.listeners('deleted'))
    return compose(stack)(this)
    /*
    const id = this.get('id') || this.get('_id')
    return this.constructor.destroy(id)
    */
  }

  validate() {
    return this.constructor.validate(this.toJSON())
  }

}
