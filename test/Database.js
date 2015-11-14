'use strict'

import _ from 'lodash'
import assert from 'assert'
import Database from '../src/Database'

describe('Database', () => {

  var db
  var driver

  before(() => {
    driver = {}
    db = new Database({ driver })
  })

  describe('#clone()', () => {

    it('should return a new database object', () => {

      assert(db.clone() !== db)

    })

  })

})
