'use strict'

import _ from 'lodash'
import compose from 'koa-compose'
import BaseModel from './BaseModel'

export default class Model extends BaseModel {

  constructor(state = null, exists = false) {
    super()

    this.fill(state)

    this.exists = exists
  }

  get attributes() {
    return this.constructor.attributes
  }

  get type() {
    return this.constructor.name
  }

  // Shorthand for the Model.hooks
  get hooks() {
    return this.constructor.hooks
  }

  // Shorthand for the Model.db
  get db() {
    return this.constructor.db
  }

  // Shorthand for the Model.primaryKey
  get primaryKey() {
    return this.constructor.primaryKey
  }

  // Shorthand for the Model.foreignKey
  get foreignKey() {
    return this.constructor.foreignKey
  }

  get tempState() {
    return this._tempState || (this._tempState = Object.create(null))
  }

  set tempState(state) {
    this._tempState = state
  }

  // get key()
  get id() {
    return _.get(this.state, this.primaryKey)
  }

  // Instance Methods

  fill(state) {
    this.state = _.pick(
      state,
      ...this.attributes
    )
    return this
  }

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
   * The hooks's lifecycle is:
   *  `saving` -> `creating` -> `create` -> `created` -> `saved`
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
      return this.constructor[`${prefix}e`](this).then(next)
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
   * Updates an instance
   *
   * The hooks's lifecycle is:
   *  `saving` -> `updating` -> `update` -> `updated` -> `saved`
   *
   * @example
   *
   *    user.update({...})
   *
   * @return {Promise}
   */
  update(value) {
    return this.fill(value).save()
  }

  /**
   * Deletes a instance
   *
   * The hooks's lifecycle is:
   *  `deleting` -> `delete` -> `deleted`
   *
   * @example
   *
   *    user.delete()
   *
   * @param {Object} attributes
   * @return {Promise}
   */
  delete() {
    if (!this.primaryKey) {
      return Promise.reject(new Error('No primary key defined on model.'))
    }

    if (!this.exists) {
      return Promise.resolve(false)
    }

    const hooks = this.hooks
    let stack = hooks.listeners('deleting')
    stack.push((_, next) => {
      const id = this.get('id') || this.get('_id')
      return this.constructor.destroy(id)
        .then(() => this.exists = false)
        .then(next)
    })
    stack.push(...hooks.listeners('deleted'))
    return compose(stack)(this).then(() => true)
    /*
    const id = this.get('id') || this.get('_id')
    return this.constructor.destroy(id)
    */
  }

  /**
   * Reloads a fresh model instance from the database
   *
   * @return {Promise<Model|NULL>}
   */
  fresh() {}

  validate() {
    return this.constructor.validate(this.toJSON())
  }

}
