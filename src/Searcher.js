import _ from 'lodash'

export default class Searcher {

  constructor() {
    this._cmd = undefined
    this._modelName = undefined
    this._selectionSet = []
    this._whereConditions = []
    this._sortConditions = []
    this._groupConditions = []
    this._updateColumns = null
    this._fieldSet = null
  }

  clone() {
    const s = Object.create(this)
    s._selectionSet = this._selectionSet.slice()
    s._whereConditions = this._whereConditions.slice()
    s._sortConditions = this._sortConditions.slice()
    s._groupConditions = this._groupConditions.slice()
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

  from(modelName, as = '') {
    this._modelName = modelName
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
          this._whereConditions.push({ column: field, operator, value })
        })
      }
      return this
    }

    if (len === 2) {
      value = operator
      operator = '='
    }

    this._whereConditions.push({ column, operator, value })

    return this
  }

  group(...columns) {
    this._groupConditions.push(...columns)
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
  sort(column, flag) {
    this._sortConditions.push([column, flag])
    return this
  }

  find() {
    this._cmd = 'find'
    return this
  }

  insert(attrs = null) {
    this._cmd = 'insert'
    this._fieldSet = attrs
    this._selectionSet.push('*')
    return this
  }

  update(attrs = null) {
    this._cmd = 'update'
    this._updateColumns = attrs
    return this
  }

  delete() {
    this._cmd = 'delete'
    return this
  }

  toJSON() {
    return {
      columns: this._selectionSet,
      model: this._modelName,
      where: this._whereConditions
    }
  }

}
