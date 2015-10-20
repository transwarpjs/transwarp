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

  describe('#schemaName', () => {

    it('should return null', () => {

      assert.equal(BaseModel.schemaName, null)

    })

  })

  describe('#schema', () => {

    it('should return an object', () => {

      assert.equal(_.isPlainObject(BaseModel.schema), true)

    })

    it('should return an empty object', () => {

      assert.equal(_.isEmpty(BaseModel.schema), true)

    })

  })

  describe('#attributes', () => {

    it('should return an array', () => {

      assert.equal(Array.isArray(BaseModel.attributes), true)

    })

    it('should return an empty array', () => {

      assert.equal(_.isEmpty(BaseModel.attributes), true)

    })

  })

  describe('#create()', () => {

    it('should return a function', () => {

      assert.equal(_.isFunction(BaseModel.create), true)
      //assert.equal(BaseModel.create().constructor, BaseModel)
      //assert.equal(BaseModel.create() instanceof BaseModel, true)
      //assert.equal(BaseModel.create().constructor, (new BaseModel).constructor)

    })

  })

  describe('#destroy()', () => {

    it('should return a function', () => {

      assert.equal(_.isFunction(BaseModel.destroy), true)
      //assert.equal(BaseModel.create().constructor, BaseModel)
      //assert.equal(BaseModel.create() instanceof BaseModel, true)
      //assert.equal(BaseModel.create().constructor, (new BaseModel).constructor)

    })

  })

})
