import Scope from './Scope'
import Searcher from './Searcher'

export default class Database {

  constructor({ driver, dialect, dsn }) {
    this.dialect = dialect
    this.driver = driver
    this.dsn = dsn
    // this.scope = new Scope(this)
    this.scope = new Scope()

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
   * @return {Promise}
   */
  connect() {
    return this.driver.connect()
  }

  // Shorthand for the database connection
  get conn() {
    return this.connect()
  }

  /**
   * Row SQL
   *
   * @param {String} sql
   * @param {*} values
   * @return {Promise}
   */
  exec(sql = '', values) {
    return this.conn.then(({ client, done }) => {
      return new Promise((resolve, reject) => {
        client.query(sql, values, (err, result) => {
          // release pool conn
          done(err)

          // error
          if (err) return reject(err)

          // response
          resolve(result)
        })
      })
    })
  }

  /**
   * Verifies a connection to the database is still alive
   *
   * @return {Promise}
   */
  ping() {
    return this.exec('/* ping */ SELECT 1;')
  }

  get searcher() {
    return this._searcher || (this._searcher = new Searcher(this))
  }

  set searcher(searcher) {
    this._searcher = searcher
    // reference current database
    this._searcher.db = this
  }

  clone() {
    const db = Object.create(this)
    db.searcher = this.searcher.clone()
    return db
  }

  // Basic CRUD

  /** Creates an instance, single inserts
   *
   * @param {Model} value - A Model Instance
   * @return {Promise}
   */
  create(value) {
    return value.save()
  }
  save() {}
  update() {}
  delete() {}

  // Query

  select(...args) {
    return this.clone().searcher.select(...args).db
  }

  from(tableName = '') {
    return this.clone().searcher.from(tableName).db
  }

  where(...args) {
    return this.clone().searcher.where(...args).db
  }

  group(...args) {
    return this.clone().searcher.group(...args).db
  }

  limit(n) {
    return this.clone().searcher.limit(n).db
  }

  // offset
  skip(n) {
    return this.clone().searcher.skip(n).db
  }

  // order
  sort(...args) {
    return this.clone().searcher.sort(...args).db
  }

  // rows
  find() {
    const scope = this.scope.clone()
    scope.build(this.searcher)
    console.log('   sql:', scope.sql)
    console.log('values:', scope.values)
    return this.exec(scope.sql, scope.values).then(({ rows }) => {
      return rows
    })
  }

  // row
  findOne() {
    this.searcher.limit(1)
    return this.find().then(rows => {
      return rows[0]
    })
  }

  count() {
  }

}
