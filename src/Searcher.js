
export default class Searcher {

  constructor(db) {
    this.db = db
    this._columns = []
    this._whereClauses = []
    this._limit
    this._skip
  }

  clone() {
    const s = Object.create(this)
    s._columns = this._columns.slice()
    s._whereClauses = this._whereClauses.slice()
    return s
  }

  select(query, ...args) {
    this._columns.push({ query, args })
    return this
  }

  where(query, ...args) {
    this._whereClauses.push({ query, args })
    return this
  }

  limit(n) {
    this._limit = n
    return this
  }

  skip() {
    this._offset = n
    return this
  }

  offset(n) {
    return this.skip(n)
  }



}
