
export default class Scope {

  // The row sql
  sql = ''
  values = null

  constructor(db) {
    this.db = db
  }

  // Gets dialect
  get dialect() {
    //return this.db.connector.dialect
    return this.db.dialect
  }

  // Shorthand for the db connection
  get conn() {
    return this.db.conn
  }

  clone() {
    const s = Object.create(this)
    return s
  }

  row(sql = '') {
    //const reg = new RegExp('\$\$', 'g')
    //this.sql = sql.replace(reg, '?')
    return this
  }

  build(sql, values) {
    this.sql = sql
    this.values = values
    return this
  }

  /**
   * Executes invoke sql
   */
  exec() {
    return this.conn
      .then(({ client, done }) => {
        return new Promise((resolve, reject) => {
          client.query(this.sql, this.values, (err, result) => {
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

}
