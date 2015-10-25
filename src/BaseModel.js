import _ from 'lodash'
import EventEmitter from 'events'
import { plural, singular } from 'pluralize'

export default class BaseModel extends EventEmitter {

  // database
  static db = null

  // http://www.postgresql.org/docs/current/static/ddl-schemas.html
  // e.g: postgres - public schema
  static schemaName = null

  // return a human-readable description of this object.
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
  static get defaultTableName() {
    return plural(this.name.toLowerCase())
  }

  // e.g: custon table name
  // static tableName = 'users'
  static get tableName() {
    return this.defaultTableName
  }

  // Model Methods

  // Attach a database
  static attach(db) {
    this.db = db
  }

  // Detach a database
  static detach() {
    delete this.db
  }

  // Clone
  static clone() {
    const m = Object.create(this)
    return m
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
   * @return {Promise}
   */
  static create(attrs) {
    const v = new this(attrs)
    return v.save()
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
   * Updates an instance
   *
   * @example
   *
   *    User.update(user)
   *    // => `UPDATE users SET field = value WHERE id = 1;`
   *
   * @param {Object} object - An instance of the Model
   * @return {Promise}
   */
  static update(o) {
    return o.save()
  }

  static select(...args) {
    this.db.select(...args)
    return this
  }

  static where(...args) {
    this.db.where(...args)
    return this
  }

  static find() {
    return this.db.from(this.tableName).find()
  }

  // Row SQL
  static exec() {}

}
