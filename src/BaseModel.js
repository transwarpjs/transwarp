'use strict'

import _ from 'lodash'
import EventEmitter from 'events'
import { plural, singular } from 'pluralize'

export default class BaseModel extends EventEmitter {

  // database
  static db = undefined

  // http://www.postgresql.org/docs/current/static/ddl-schemas.html
  // e.g: postgres - public schema
  static schemaName = undefined

  // Returns a human-readable description of this object.
  static description = undefined

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

  // Basic CRUD

  /**
   * Creates an instance of the Model
   *
   * @example
   *
   *    // For RDB
   *
   *    User.create({})
   *    // => `BEGIN TRANSACTION;`
   *    // => `INSERT INTO users () VALUES ();`
   *    // => `COMMIT;`
   *
   * @param {Object} attrs
   * @return {Promise<Model>}
   */
  static create(value) {
    if (!(value instanceof BaseModel)) {
      const M = getModel(this)
      value = new M(value)
    }

    const error = value.validate()

    // throw error
    if (error) return Promise.reject(error)

    return this.db.create(value).then(row => {
      if (row) {
        Object.keys(row).forEach(field => value.set(field, row[field]))
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
      return rows.map(row => new M(row))
    })
  }

  /**
   * Gets first model
   *
   * @return {Promise<Model>}
   */
  static first() {
    const M = getModel(this)
    return this.db.from(this).first().then(row => {
      return row ? new M(row) : null
    })
  }

  /**
   * Gets last model
   *
   * @return {Promise<Model>}
   */
  static last() {
    const M = getModel(this)
    return this.db.from(this).last().then(row => {
      return row ? new M(row) : null
    })
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
    return this.db.update(value).then(row => {
      if (row) {
        Object.keys(row).forEach(field => value.set(field, row[field]))
      }
      return value
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
