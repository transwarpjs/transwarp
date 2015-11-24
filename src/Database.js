'use strict'

import Scope from './Scope'
import Model from './Model'

export default class Database {

  constructor({ driver, dsn, logger }) {
    this.driver = driver
    this.dsn = dsn
    this.logger = logger

    Object.defineProperty(this.driver, 'db', {
      configurable: true,
      enumerable: false,
      writable: true,
      value: this
    })
  }

  /**
   * Connects the database
   *
   * @return {Promise<Connection>}
   */
  connect() {
    return this.driver.connect(this.dsn)
  }

  /**
   * Shorthand for the database connection
   *
   * @return {Promise<Connection>}
   */
  get conn() {
    return this.connect()
  }

  /**
   * Verifies a connection to the database is still alive
   *
   * @return {Promise<Boolean>}
   */
  ping() {
    if (this.driver.ping) return this.driver.ping(this.conn)
    return Promise.reject(new Error('Database `driver#ping()` need implement!'))
  }

  /**
   * Executes a raw SQL / Command
   *
   * @return {Promise<Result>}
   */
  exec(...args) {
    if (this.driver.exec) return this.driver.exec(this.conn, ...args)
    return Promise.reject(new Error('Database `driver#exec()` need implement!'))
  }

  /**
   * Gets the scope
   *
   * @return {Scope}
   */
  get scope() {
    return this._scope || (this._scope = new Scope())
  }

  /**
   * Sets the scope
   *
   * @param {Scope} scope
   * @return {Database}
   */
  set scope(scope) {
    this._scope = scope
    return this
  }

  /**
   * Clones the current database
   *
   * @return {Database}
   */
  clone() {
    const db = Object.create(this)
    db.scope = this.scope.clone()
    db.scope.db = db
    return db
  }

  /**
   * Gets current dialect
   *
   * @return {Object}
   */
  get dialect() {
    return this.driver.dialect
  }


  // Basic CRUD

  // Note(fundon): rename to `setModel()`
  from(m) {
    const db = this.clone()
    db.scope.searcher.from((Object.getPrototypeOf(m) === Model) ? m.modelName : m)
    return db
  }

  create(value) {
    const scope = this.scope.clone()
    scope.searcher.insert(value.state)
    scope.value = value
    return this.driver.insert(scope)
  }

  find() {
    const scope = this.scope.clone()
    scope.searcher.find()
    return this.driver.find(scope)
  }

  first() {
    const scope = this.scope.clone()
    scope.searcher.limit(1).find()
    return this.driver.find(scope)
  }

  last() {
    const scope = this.scope.clone()
    scope.searcher.sort('id', 'DESC').limit(1).find()
    return this.driver.find(scope)
  }

  count() {
    const scope = this.scope.clone()
    scope.searcher.find()
    return this.driver.count(scope)
  }

  update(value) {
    const scope = this.scope.clone()
    scope.searcher.update(
      value.toJSON({ only: Object.keys(value.tempState) })
    )
    scope.value = value
    return this.driver.update(scope)
  }

  destroy(...ids) {
    const scope = this.scope.clone()
    const searcher = scope.searcher
    searcher.delete()
    if (ids.length === 1) {
      searcher.where('id', ids[0])
    } else if (ids.length > 1) {
      searcher.where('id', 'in', ids)
    }
    return this.driver.delete(scope)
  }

}
