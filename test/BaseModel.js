import assert from 'assert'
import BaseModel from '../src/BaseModel'

describe('BaseModel', () => {

  describe('#create()', () => {

    it('should return an instance', () => {

      assert.equal(BaseModel.create().constructor, BaseModel)
      assert.equal(BaseModel.create() instanceof BaseModel, true)

    })

  })

})
