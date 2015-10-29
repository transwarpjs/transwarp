import _ from 'lodash'
import EventEmitter from 'events'
import { plural, singular } from 'pluralize'

export default class BaseModel extends EventEmitter {

  // database
  static db = null

  // http://www.postgresql.org/docs/current/static/ddl-schemas.html
  // e.g: postgres - public schema
  static schemaName = null

  // Returns a human-readable description of this object.
  static description = null

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

  // Model Methods

  // Attach a database
  static attach(db) {
    this.db = db
  }

  // Detach a database
  static detach() {
    this.db = null
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
   * Gets models
   *
   * @return {Promise<[]Model>}
  */
  static find() {
    return this.db.from(this).find().then(rows => {
      return rows.map(row => new (getModel(this))(row))
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
  }

  /**
   * Gets first model
   *
   * @return {Promise<Model>}
   */
  static first() {
    return this.db.from(this).first().then(row => {
      return row ? new (getModel(this))(row) : null
    })
  }

  /**
   * Gets last model
   *
   * @return {Promise<Model>}
   */
  static last() {
    return this.db.from(this).last().then(row => {
      return row ? new (getModel(this))(row) : null
    })
  }

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
    if (!(value instanceof BaseModel)) value = new this(value)
    return this.db.create(value).then(row => {
      if (row) {
        Object.keys(row).forEach(field => value.set(field, row[field]))
      }
      return value
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
    if (!(value instanceof BaseModel)) value = new this(value)
    return this.db.update(value).then(row => {
      if (row) {
        Object.keys(row).forEach(field => value.set(field, row[field]))
      }
      return value
    })
  }

}

function getModel(m) {
  return m.Model || m
}
