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

  /**
   * Creates an instance of the Model
   *
   * @example
   *
   *  User.create({})
   *  new User({})
   *
   * @param {Object} attributes
   * @returns {Model} Any Model
   */
  static create(attributes) {
    const m = new this(attributes)
    return m
  }

}
