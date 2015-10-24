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

    it('should not empty in `this.columns`', () => {

      assert(searcher.columns.length > 0)

    })

  })

  describe('#where()', () => {

    it('should return self', () => {

      assert(searcher.where('name = ?', 'fangdun') === searcher)

    })

    it('should not empty in `this.whereClauses`', () => {

      assert(searcher.whereClauses.length > 0)

    })

  })

  describe('#clone()', () => {

    it('should return a new searcher object', () => {

      assert(searcher.clone() !== searcher)

    })

  })

})
