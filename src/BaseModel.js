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
    // TODO: when use `Object.create` just return an object not original Function
    m.class = this.class || this
    return m
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

  static select(...args) {
    const m = this.clone()
    // TODO: override, must be?
    m.db = m.db.select(...args)
    return m
  }

  static where(...args) {
    const m = this.clone()
    // TODO: override, must be?
    m.db = m.db.where(...args)
    return m
  }

  static group(...args) {
    const m = this.clone()
    // TODO: override, must be?
    m.db = m.db.group(...args)
    return m
  }

  static limit(n) {
    const m = this.clone()
    // TODO: override, must be?
    m.db = m.db.limit(n)
    return m
  }

  static skip(n) {
    const m = this.clone()
    // TODO: override, must be?
    m.db = m.db.skip(n)
    return m
  }

  static sort(...args) {
    const m = this.clone()
    // TODO: override, must be?
    m.db = m.db.sort(...args)
    return m
  }

  /**
   * Gets models
   *
   * @return {Promise<[]Model>}
   */
  static find() {
    const M = this.class || this
    return this.db.from(this.tableName).find().then(rows => {
      return rows.map(row => {
        return new M(row)
      })
    })
  }

  /**
   * Gets first model
   *
   * @return {Promise<Model>}
   */
  static first() {
    // TODO: maybe `this` comes from `Object.create(this)`
    //        so need store the constructor
    const M = this.class || this
    return this.db.from(this.tableName).first().then(row => {
      return row ? new M(row) : null
    })
  }

  /**
   * Gets last model
   *
   * @return {Promise<Model>}
   */
  static last() {
    // TODO: maybe `this` comes from `Object.create(this)`
    //        so need store the constructor
    const M = this.class || this
    return this.db.from(this.tableName).last().then(row => {
      return row ? new M(row) : null
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
   * @return {Promise}
   */
  static create(value) {
    if (!(value instanceof BaseModel)) value = new this(value)
    return this.db.create(value).then(result => {
      return result
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
   * @return {Promise}
   */
  static update(value) {
    if (!(value instanceof BaseModel)) value = new this(value)
    return this.db.update(value).then(result => {
      return result
    })
  }

}
