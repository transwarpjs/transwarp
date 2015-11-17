'use strict'

import _ from 'lodash'

export default class Scope {

  clone() {
    const s = Object.create(this)
    return s
  }

  build(searcher) {
    return this
  }

}
