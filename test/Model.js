import _ from 'lodash'
import assert from 'assert'
import Model from '../src/Model'

describe('Model', () => {

  var m

  before(() => {
    Model.schema = {
      id:       'integer',
      username: 'string',
      email:    'string'
    }
    m = new Model({
      id:       23,
      username: 'jordan',
      email:    'jordan@nba.com'
    })
  })

  describe('#toJSON()', () => {

    it('should return all attributes', () => {

      assert.deepEqual(m.toJSON(),  _.pick(m.state, m.attributes))

    })

    it('should return except attributes', () => {

      assert.deepEqual(m.toJSON({ except: ['id'] }),  _.omit(m.state, 'id'))

    })

    it('should return only attributes', () => {

      assert.deepEqual(m.toJSON({ only: ['id'] }),  _.pick(m.state, 'id'))

    })


  })

})
