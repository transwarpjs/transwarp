import Scope from './Scope'
import Searcher from './Searcher'

export default class Database {

  constructor({ driver, dialect, dsn }) {
    this.dialect = dialect
    this.driver = driver
    this.dsn = dsn
    this.scope = new Scope(this)

    Object.defineProperty(this.driver, 'db', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: this
    })
  }

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
  exec(sql = '', ...values) {
    const scope = new Scope(this)
    scope.build(sql, values)
    return scope.exec()
  }

  /**
   * Verifies a connection to the database is still alive
   *
   * @return {Promise}
   */
  ping() {
    return this.conn.then(({ client, done }) => {
        return new Promise((resolve, reject) => {
          client.query('', (err, result) => {
            // release pool conn
            done(err)

            // error
            if (err) return reject(err)

            // response
            resolve()
          })
        })
      })
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

  select(...args) {
    return this.clone().searcher.select(...args).db
  }

  where(...args) {
    return this.clone().searcher.where(...args).db
  }

  // Query

  find() {
    return this.exec()
  }

  // first() {}
  // last() {}

  // select() {}
  // eq() {}
  // gt() {}
  // lt() {}
  // gte() {}
  // lte() {}
  // neq() {}
  // like() {}
  // ilike() {}
  // // full-text search
  // fts() {}
  // is() {}
  // isnot() {}
  // in() {}
  // notin() {}
  // not() {}
  // or() {}

  // Bulk inserts, From `csv`, `json`
  // bulkInsert() {}
}
