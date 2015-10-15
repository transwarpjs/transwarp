import assert from 'assert'
import BaseModel from '../src/BaseModel'

describe('BaseModel', () => {

  describe('#create()', () => {

    it('should return an instance', () => {

      assert.equal(BaseModel.create().constructor, BaseModel)
      assert.equal(BaseModel.create() instanceof BaseModel, true)
      assert.equal(BaseModel.create().constructor, (new BaseModel).constructor)

    })

  })

  describe('#defaultTableName', () => {

    it('should get a table name by default', () => {

      assert.equal(BaseModel.defaultTableName, 'basemodels')

    })

  })

  describe('#tableName', () => {

    it('shoudl equal to default table name', () => {

      assert.equal(BaseModel.tableName, BaseModel.defaultTableName)

    })

    it('should get a table name', () => {

      assert.equal(BaseModel.tableName, 'basemodels')

    })

  })

})
