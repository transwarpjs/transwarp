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

  get dialect() {
    return this.driver.dialect
  }


  // Basic CRUD

  from(m) {
    const db = this.clone()
    db.searcher.from((m instanceof Model) ? m.modelName : m)
    return db
  }

  create(value) {
    this.searcher.create(value)
    this.scope.build(this.searcher)
    return this.driver.insert(this.conn, this.scope)
  }

  find() {
    this.searcher.find();
    this.scope.build(this.searcher)
    return this.driver.find(this.conn, this.scope)
  }

  update() {
    this.searcher.update();
    this.scope.build(this.searcher)
    return this.driver.update(this.conn, this.scope)
  }

  destroy() {
    this.searcher.delete();
    this.scope.build(this.searcher)
    return this.driver.delete(this.conn, this.scope)
  }

}
