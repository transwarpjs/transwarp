import _ from 'lodash'

export default class Searcher {

  constructor(/* db */) {
    // this.db = db
    this._groupClauses = []
    this._sortClauses = []
    this._updateColumns = []
    this._tableName = null

    this._selectionSet = []
    this._whereCondition = []
    this._fieldSet = null
  }

  clone() {
    const s = Object.create(this)
    // override reference
    s._selectionSet = this._selectionSet.slice()
    // override reference
    s._whereCondition = this._whereCondition.slice()
    // override reference
    s._groupClauses = this._groupClauses.slice()
    // override reference
    s._sortClauses = this._sortClauses.slice()
    // override reference
    s._updateColumns = Object.create(this._updateColumns)
    s._fieldSet = Object.create(this._fieldSet)
    // s._limit = null
    // s._skip = null
    return s
  }

  select(...columns) {
    this._selectionSet.push(...columns)
    return this
  }

  from(tableName, as = '') {
    this._tableName = tableName
    this._as = ''
    return this
  }

  where(...args) {
    const len = args.length

    // Nothing
    if (len === 0) return this

    // Fetches variables
    let [column, operator, value] = args

    if (len === 1) {
      if (_.isObject(column)) {
        const keys = Object.keys(column)
        keys.forEach(key => {
          let [field, operator, value] = [key, '=', column[key]]
          this._whereCondition.push({ column: field, operator, value })
        })
      }
      return this
    }

    if (len === 2) {
      value = operator
      operator = '='
    }

    this._whereCondition.push({ column, operator, value })

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

  update(attrs = null) {
    this._updateColumns = attrs
    return this
  }

  create(attrs = null) {
    this._fieldSet = attrs
    this._selectionSet.push('*')
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
