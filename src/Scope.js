'use strict'

import _ from 'lodash'

export default class Scope {

  constructor(db, searcher, value) {
    this.db = db
    this.searcher = searcher
    this.value = value
  }

  clone() {
    const s = Object.create(this)
    return s
  }

}
