import _ from 'lodash'
import assert from 'assert'
import BaseModel from '../src/BaseModel'

describe('BaseModel', () => {


  describe('#defaultTableName', () => {

    it('should get a table name by default', () => {

      assert.equal(BaseModel.defaultTableName, 'basemodels')

    })

  })

  describe('#tableName', () => {

    it('should equal to default table name', () => {

      assert.equal(BaseModel.tableName, BaseModel.defaultTableName)

    })

    it('should get a table name', () => {

      assert.equal(BaseModel.tableName, 'basemodels')

    })

  })

  describe('#schema', () => {

    it('should return null', () => {

      assert.equal(BaseModel.schema, null)

    })

  })

  describe('#attributes', () => {

    it('should return an empty object', () => {

      assert.equal(_.isEmpty(BaseModel.attributes), true)

    })

  })

  describe('#create()', () => {

    it('should return an instance', () => {

      assert.equal(BaseModel.create().constructor, BaseModel)
      assert.equal(BaseModel.create() instanceof BaseModel, true)
      assert.equal(BaseModel.create().constructor, (new BaseModel).constructor)

    })

  })

})
