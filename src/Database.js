import Scope from './Scope'

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

  // Basic CRUD

  /** Creates an instance
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

  find() {}
  first() {}
  last() {}

  where() {}
  not() {}
  or() {}

}
