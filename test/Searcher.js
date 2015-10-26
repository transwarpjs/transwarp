import _ from 'lodash'
import assert from 'assert'
import Searcher from '../src/Searcher'

describe('Searcher', () => {

  var searcher

  before(() => {
    searcher = new Searcher()
  })

  describe('#select()', () => {

    it('should return self', () => {

      assert(searcher.select('name, age') === searcher)

    })

    it('should not empty in `this._selectColumns`', () => {

      assert(searcher._selectColumns.length > 0)

    })

  })

  describe('#where()', () => {

    it('should return self', () => {

      assert(searcher.where('name = ?', 'spock') === searcher)

    })

    it('should not empty in `this._whereClauses`', () => {

      assert(searcher._whereClauses.length > 0)

    })

  })

  describe('#clone()', () => {

    it('should return a new searcher object', () => {

      assert(searcher.clone() !== searcher)

    })

  })

})
