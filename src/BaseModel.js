'use strict'

import _ from 'lodash'
import { plural, singular } from 'pluralize'
import EventEmitter from 'events'
import Hooks from './Hooks'

export default class BaseModel extends EventEmitter {

  // database
  static db = undefined

  // http://www.postgresql.org/docs/current/static/ddl-schemas.html
  // e.g: postgres - public schema
  static schemaName = undefined

  // Returns a human-readable description of this object.
  static description = undefined

  // Returns the primary key.
  static get primaryKey() {
    return 'id'
  }

  // Returns the foreign key
  static get foreignKey() {
    return `${this.name.toLowerCase()}Id`
  }

  /**
   * Defines the Model Schema
   *
   * @example
   *
   *    class User extends Model {
   *      static schema = {
   *        name: {
   *          type: 'string'
   *        }
   *      }
   *    }
   */
  static schema = Object.create(null)

  /**
   * Gets attributes of the Model Schema
   *
   * @return {Array}
   */
  static get attributes() {
    return Object.keys(this.schema)
  }

  static get type() {
    return plural(this.name.toLowerCase())
  }

  // User -> users
  static get defaultModelName() {
    return plural(this.name.toLowerCase())
  }

  // e.g: custon model name
  // static modelName = 'users'
  static get modelName() {
    return this.defaultModelName
  }

  // Attach a database
  static attach(db) {
    this.db = db
  }

  // Detach a database
  static detach() {
    this.db = undefined
  }

  static isCloned = false

  // Clone
  static clone() {
    const m = Object.create(this)

    if (!m.isCloned) {
      Object.defineProperty(m, 'Model', {
        enumerable: true,
        value: this
      })
      m.isCloned = true
    }

    return m
  }

  // boot
  static boot() {}

  // hooks
  static get hooks() {
    return this._hooks || (this._hooks = new Hooks())
  }


  // Basic CRUD

  /**
   * Creates an instance of the Model
   *
   * @param {Object} value
   * @return {Promise<Model>}
   */
  static create(value) {
    if (!(value instanceof BaseModel)) {
      const M = getModel(this)
      value = new M(value)
    }

    return this.db.from(this).create(value).then(rows => {
      if (rows.length) {
        const row = rows[0]
        Object.keys(row).forEach(field => value.set(field, row[field]), true)
        value.exists = true
      }
      return value
    })
  }

  /**
   * Gets models
   *
   * @return {Promise<[]Model>}
   */
  static find() {
    let M = getModel(this)
    return this.db.from(this).find().then(rows => {
      return rows.map(row => new M(row, true))
    })
  }

  /**
   * Gets first model
   *
   * @return {Promise<Model>}
   */
  static first() {
    const M = getModel(this)
    return this.db.from(this).first().then(rows => {
      return rows.length ? new M(rows[0], true) : null
    })
  }

  /**
   * Gets last model
   *
   * @return {Promise<Model>}
   */
  static last() {
    const M = getModel(this)
    return this.db.from(this).last().then(rows => {
      return rows.length ? new M(rows[0], true) : null
    })
  }

  /**
   * Counts the model
   */
  static count() {
    return this.db.from(this).count()
  }

  /**
   * Updates an instance
   *
   * @example
   *
   *    User.update(user)
   *    // => `UPDATE users SET field = value WHERE id = 1;`
   *
   * @param {Object} object - An instance of the Model
   * @return {Promise<Model>}
   */
  static update(value) {
    if (!(value instanceof BaseModel)) {
      const M = getModel(this)
      value = new M(value)
    }
    return this.db.from(this).update(value).then(row => {
      if (row) {
        Object.keys(row).forEach(field => value.set(field, row[field], true))
        value.tempState = null
      }
      value.exists = true
      return value
    }).catch(err => {
      Object.keys(value.tempState).forEach(field => {
        value.set(field, row[field], true)
      })
      return Promise.reject(err)
    })
  }

  /**
   * Destroys records by Key
   *
   * @example
   *
   *    User.destroy(1)
   *    User.destroy([1, 2, 3])
   *    User.destroy(1, 2, 3)
   *    // => `DELETE FROM users WHERE id IN (1, 2, 3);`
   *
   * @param {Array} ...ids
   * @return {Promise}
   */
  static destroy(...ids) {
    ids = _.flattenDeep(ids)
    return this.db.from(this).destroy(...ids)
  }

  static validate(value) {
    return undefined
  }

}

function getModel(m) {
  return m.Model || m
}
