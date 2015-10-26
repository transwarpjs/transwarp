
export default class Searcher {

  constructor(db) {
    this.db = db
    this._selectColumns = []
    this._whereClauses = []
    this._groupClauses = []
    this._sortClauses = []
    this._updateColumns = []
    this._tableName = null
  }

  clone() {
    const s = Object.create(this)
    // override reference
    s._selectColumns = this._selectColumns.slice()
    // override reference
    s._whereClauses = this._whereClauses.slice()
    // override reference
    s._groupClauses = this._groupClauses.slice()
    // override reference
    s._sortClauses = this._sortClauses.slice()
    // override reference
    s._updateColumns = this._updateColumns.slice()
    // s._limit = null
    // s._skip = null
    return s
  }

  select(...columns) {
    this._selectColumns.push(...columns)
    return this
  }

  from(tableName) {
    this._tableName = tableName
    return this
  }

  where(query, ...args) {
    this._whereClauses.push({ query, args })
    return this
  }

  group(...columns) {
    this._groupClauses.push(...columns)
    return this
  }

  limit(n) {
    this._limit = n
    return this
  }

  // offset
  skip(n) {
    this._skip = n
    return this
  }

  // order
  sort(...args) {
    this._sortClauses.push(...args)
    return this
  }

  update(...args) {
    this._updateColumns.push(...args)
    return this
  }

  toJSON() {
    return {
      columns: this._selectColumns,
      table: this._tableName,
      where: this._whereClauses
    }
  }

}
