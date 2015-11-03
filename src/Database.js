import Scope from './Scope'
import Searcher from './Searcher'
import Queryable from './Queryable'
import Model from './Model'

export default class Database extends Queryable {

  constructor({ dialect, driver, dsn, logger }) {
    super()

    this.dialect = dialect
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
    return db
  }

}
