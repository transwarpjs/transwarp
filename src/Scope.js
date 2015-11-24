'use strict'

import _ from 'lodash'
import Searcher from './Searcher'

export default class Scope {

  constructor(db, searcher, value) {
    this.db = db
    this.searcher = searcher
    this.value = value
  }

  /**
   * Gets the searcher
   *
   * @return {Searcher}
   */
  get searcher() {
    return this._searcher || (this._searcher = new Searcher())
  }

  /**
   * Sets the searcher
   *
   * @param {Searcher} searcher
   * @return {Scope}
   */
  set searcher(searcher) {
    this._searcher = searcher
    return this
  }

  clone() {
    const s = Object.create(this)
    s.searcher = s.searcher.clone()
    return s
  }

}
