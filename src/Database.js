import Scope from './Scope'
import Searcher from './Searcher'

export default class Database {

  constructor({ driver, dialect, dsn }) {
    this.dialect = dialect
    this.driver = driver
    this.dsn = dsn
    this.scope = new Scope(/* this */)

    Object.defineProperty(this.driver, 'db', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: this
    })
  }

  /**
   * Connects the database
   *
   * @return {Promise<Connection>}
   */
  connect() {
    return this.driver.connect()
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
    return this.conn.then(({ client, done }) => {
      return new Promise((resolve, reject) => {
        client.query(sql, values, (err, result) => {
          // release pool conn
          done(err)

          // throw err or response result
          err ? reject(err) : resolve(result)
        })
      })
    })
  }

  /**
   * Verifies a connection to the database is still alive
   *
   * @return {Promise<Result>}
   */
  ping() {
    if (this.driver.ping) return this.driver.ping()
    return this.exec('/* ping */ SELECT 1;')
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

  select(...args) {
    const db = this.clone()
    db.searcher.select(...args)
    return db
    // return this.clone().searcher.select(...args).db
  }

  // Collection
  from(tableName = '') {
    const db = this.clone()
    db.searcher.from(tableName)
    return db
    // return this.clone().searcher.from(tableName).db
  }

  where(...args) {
    const db = this.clone()
    db.searcher.where(...args)
    return db
    // return this.clone().searcher.where(...args).db
  }

  group(...args) {
    const db = this.clone()
    db.searcher.group(...args)
    return db
    // return this.clone().searcher.grup(...args).db
  }

  limit(n) {
    const db = this.clone()
    db.searcher.limit(n)
    return db
    // return this.clone().searcher.limit(n).db
  }

  // offset
  skip(n) {
    const db = this.clone()
    db.searcher.skip(n)
    return db
    // return this.clone().searcher.skip(n).db
  }

  // order
  sort(...args) {
    const db = this.clone()
    db.searcher.sort(...args)
    return db
    // return this.clone().searcher.sort(...args).db
  }

  /**
   * Executes a query that returns rows
   *
   * @return {Promise<Rows>}
   */
  find() {
    const scope = this.scope.clone()
    scope.build('SELECT', this.searcher)
    console.log('   sql:', scope.sql)
    console.log('values:', scope.values)
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

  update(attrs) {
    const scope = this.scope.clone()
    this.searcher.update(attrs)
    scope.build('UPDATE', this.searcher)
    console.log('   sql:', scope.sql)
    console.log('values:', scope.values)
    return this.exec(scope.sql, scope.values).then(({ rows }) => {
      return rows
    })
  }

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
    return value.save()
  }

  // save() {}

}
