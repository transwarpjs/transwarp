import Scope from './Scope'

export default class Database {

  constructor({ driver, dsn }) {
    this.driver = driver
    this.dsn = dsn

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

  get connection() {
    return this.connect()
  }

  /**
   * Row SQL
   *
   * @param {String} sql
   * @param {*} values
   * @returns {Promise}
   */
  exec(sql = '', ...values) {
    const scope = new Scope({ db: this })
    scope.build(sql, values)
    return scope.exec()
  }

  /**
   * Verifies a connection to the database is still alive
   *
   * @returns {Promise}
   */
  ping() {
    return this.connection
      .then(({ client, done }) => {
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

}
