'use strict'

import Scope from './Scope'
import Searcher from './Searcher'
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
   * @return {Promise<Result>}
   */
  ping() {
    if (this.driver.ping) return this.driver.ping(this.conn)
    return Promise.reject(new Error('`Database driver#ping()` need implement!'))
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
   * Gets the searcher
   *
   * @return {Searcher}
   */
  get searcher() {
    return this._searcher || (this._searcher = new Searcher())
  }

  /**
   * Sets the searcher
   *
   * @param {Searcher} searcher
   * @return {Database}
   */
  set searcher(searcher) {
    this._searcher = searcher
    return this
  }

  /**
   * Clones the current database
   *
   * @return {Database}
   */
  clone() {
    const db = Object.create(this)
    db.searcher = this.searcher.clone()
    db.scope = this.scope.clone()
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

  from(m) {
    const db = this.clone()
    db.searcher.from((Object.getPrototypeOf(m) === Model) ? m.modelName : m)
    return db
  }

  create(value) {
    const db = this.clone()
    const scope = db.scope.clone()
    scope.db = db
    scope.searcher = db.searcher.insert()
    scope.value = value
    return this.driver.insert(scope)
  }

  find() {
    const db = this.clone()
    const scope = db.scope.clone()
    scope.db = db
    scope.searcher = db.searcher.find()
    return this.driver.find(scope)
  }

  first() {
    const db = this.clone()
    const scope = db.scope.clone()
    scope.db = db
    scope.searcher = db.searcher.find()
    db.searcher.limit(1)
    return this.driver.find(scope)
  }

  last() {
    const db = this.clone()
    const scope = db.scope.clone()
    scope.db = db
    scope.searcher = db.searcher.find().sort('id', 'DESC').limit(1)
    return this.driver.find(scope)
  }

  count() {
    const db = this.clone()
    const scope = db.scope.clone()
    scope.db = db
    scope.searcher = db.searcher.find()
    return this.driver.count(scope)
  }

  update(value) {
    console.log(value.tempState)
    const db = this.clone()
    const scope = db.scope.clone()
    scope.db = db
    scope.searcher = db.searcher.update(
      value.toJSON({ only: Object.keys(value.tempState) }))
    scope.value = value
    return this.driver.update(scope)
  }

  destroy() {
    this.searcher.delete()
    this.scope.build(this.searcher)
    return this.driver.delete(this.conn, this.scope)
  }

}
