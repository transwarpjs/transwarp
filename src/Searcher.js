'use strict'

import _ from 'lodash'

export default class Searcher {

  constructor() {
    this._aggregateConditions = []
    this._fieldSet = null
    this._groupConditions = []
    this._havingConditions = []
    this._joinConditions = []
    this._selectionSet = []
    this._sortConditions = []
    this._unionConditions = []
    this._updateColumns = null
    this._whereConditions = []
  }

  clone() {
    const s = Object.create(this)
    s._aggregateConditions = this._aggregateConditions.slice()
    s._fieldSet = Object.create(this._fieldSet)
    s._groupConditions = this._groupConditions.slice()
    s._havingConditions = this._havingConditions.slice()
    s._joinConditions = this._joinConditions.slice()
    s._selectionSet = this._selectionSet.slice()
    s._sortConditions = this._sortConditions.slice()
    s._unionConditions = this._unionConditions.slice()
    s._updateColumns = Object.create(this._updateColumns)
    s._whereConditions = this._whereConditions.slice()
    return s
  }

  select(...columns) {
    this._selectionSet.push(...columns)
    return this
  }

  from(modelName, as = '') {
    this.modelName = modelName
    this.as = as
    return this
  }

  where(...args) {
    const len = args.length

    // Nothing
    if (len === 0) return this

    // Fetches variables
    const column = args[0]
    let operator = args[1]
    let value = args[2]

    if (len === 1) {
      if (_.isObject(column)) {
        const keys = Object.keys(column)
        keys.forEach(key => {
          const [field, operator, value] = [key, '=', column[key]]
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

  having(...columns) {
    this._havingConditions.push(...columns)
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
    this.cmd = 'FIND'
    return this
  }

  insert(attrs = null) {
    this.cmd = 'INSERT'
    this._fieldSet = attrs
    return this
  }

  update(attrs = null) {
    this.cmd = 'UPDATE'
    this._updateColumns = attrs
    return this
  }

  delete() {
    this.cmd = 'DELETE'
    return this
  }

  toJSON() {
    return {
      command: this.cmd,
      columns: this._selectionSet,
      model: this.modelName,
      where: this._whereConditions
    }
  }

}
