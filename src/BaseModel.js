import EventEmitter from 'events'
import { plural, singular } from 'pluralize'

export default class BaseModel {

  // eg. postgres: public schema
  static schema = null

  // Returns a human-readable description of this object.
  static description = null

  static attributes = Object.create(null)

  static get attrNames() {
    return Object.keys(this.attributes)
  }

  static get type() {
    return plural(this.name.toLowerCase())
  }

  // User -> users
  static get defaultTableName() {
    return plural(this.name.toLowerCase())
  }

  // eg. custon table name
  // static tableName = 'users'
  static get tableName() {
    return this.defaultTableName
  }

  // Model Methods

  /**
   * Creates an instance of the Model
   *
   * @example
   *
   *    var user = User.create({}) // Or new User({})
   *    user.save()
   *    // => `INSERT INTO users () VALUES ();`
   *
   * @param {Object} attributes
   * @returns {Promise}
   */
  static create(attributes) {
    const m = new this(attributes)
    return m.save()
  }

  /**
   * Destroys records by Key
   *
   * @example
   *
   *    User.destroy(1)
   *    User.destroy([1, 2, 3])
   *    User.destroy(1, 2, 3)
   *
   * @param {Array} ...ids
   * @returns {Promise}
   */
  static destroy(...ids) {}

}
