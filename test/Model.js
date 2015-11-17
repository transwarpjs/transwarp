'use strict'

import _ from 'lodash'
import assert from 'assert'
import BaseModel from '../src/BaseModel'
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

  it('should extends BaseModel', () => {

    assert.equal(Object.getPrototypeOf(Model), BaseModel)

  })

  describe('#attributes', () => {

    it('should return all schema attributes', () => {

      assert.deepEqual(m.attributes, Object.keys(Model.schema))

    })

  })

  describe('#type', () => {

    it('should return constructor name', () => {

      assert.equal(m.type, Model.name)

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
