import EventEmitter from 'events'
import { plural, singular } from 'pluralize'

export default class BaseModel {

  static create(attributes) {
    const m = new this(attributes)
    return m
  }

  static schema = Object.create(null)

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

  // eg. custon table name
  // static tableName = 'users'
  static get tableName() {
    return this.defaultTableName
  }

  // eg. postgres
  static get schemaName() {}
}
