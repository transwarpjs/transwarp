import Scope from './Scope'
import Searcher from './Searcher'
import Queryable from './Queryable'
import Model from './Model'

export default class Database extends Queryable {

  constructor({ driver, dialect, dsn, logger }) {
    super()

    this.dialect = dialect
    this.driver = driver
    this.dsn = dsn
    this.logger = logger
    this.scope = new Scope(/* this */)

    Object.defineProperty(this.driver, 'db', {
      enumerable: false,
      configurable: true,
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
   * Executes Row SQL
   *
   * @param {String} sql - the row sql string
   * @param {Array} values
   * @return {Promise<Result>}
   */
  exec(sql = '', values) {
    if (this.driver.exec) return this.driver.exec(this.conn, sql, values)
    return Promise.reject(new Error('`Database driver#exec()` need implement!'))
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
    // reference current database
    // this._searcher.db = this
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

  // Basic CRUD

  // Query

  /**
   * Executes a query that returns rows
   *
   * @return {Promise<Rows>}
   */
  find() {
    const scope = this.scope.clone()
    scope.build('SELECT', this.searcher)
    return this.exec(scope.sql, scope.values).then(({ rows }) => {
      return rows
    })
  }

  /**
   * Executes a query that returns row
   *
   * @return {Promise<Row>}
   */
  first() {
    // TODO: if it has PK, not need to use limit
    this.searcher.limit(1)
    return this.find().then(rows => {
      return rows[0]
    })
  }

  /**
   * Executes a query that returns row
   *
   * @return {Promise<Row>}
   */
  last() {
    // TODO: if it has PK, not need to use limit
    this.searcher.limit(1)
    // TODO: check PK, maybe it's not id.
    this.searcher.order('id DESC')
    return this.find().then(rows => {
      return rows[0]
    })
  }

  count() {}

  delete() {
    const scope = this.scope.clone()
    scope.build('DELETE', this.searcher)
    console.log('   sql:', scope.sql)
    console.log('values:', scope.values)
  }

  /** Creates an instance, single inserts
   *
   * @param {Model} value - A Model Instance
   * @return {Promise}
   */
  create(value) {
    if (!(value instanceof Model)) {
      return Promise.reject(
        new TypeError('The value is not a Model Instance!')
      )
    }

    const db = this.from(value.ctor.tableName)
    const scope = db.scope.clone()
    db.searcher.create(value.toJSON())
    scope.build('CREATE', db.searcher)
    return db.exec(scope.sql, scope.values).then(({ rows }) => {
      return rows[0]
    })
  }

  update(value) {
    if (!(value instanceof Model)) {
      return Promise.reject(
        new TypeError('The value is not a Model Instance!')
      )
    }

    const db = this.from(value.ctor.tableName)
    const scope = db.scope.clone()
    db.searcher.update(value.toJSON())
    scope.build('UPDATE', db.searcher)
    return db.exec(scope.sql, scope.values).then(({ rows }) => {
      return rows[0]
    })
  }


  // save() {}


}
