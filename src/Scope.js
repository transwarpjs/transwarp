
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

}
