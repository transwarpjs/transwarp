'use strict'

import _ from 'lodash'
import assert from 'assert'
import BaseModel from '../src/BaseModel'

describe('BaseModel', () => {


  describe('.defaultModelName', () => {

    it('should get a model name by default', () => {

      assert.equal(BaseModel.defaultModelName, 'basemodels')

    })

  })

  describe('.modelName', () => {

    it('should equal to default model name', () => {

      assert.equal(BaseModel.modelName, BaseModel.defaultModelName)

    })

    it('should get a model name', () => {

      assert.equal(BaseModel.modelName, 'basemodels')

    })

  })

  describe('.schemaName', () => {

    it('should return null', () => {

      assert.equal(BaseModel.schemaName, null)

    })

  })

  describe('.schema', () => {

    it('should return an object', () => {

      assert.equal(_.isPlainObject(BaseModel.schema), true)

    })

    it('should return an empty object', () => {

      assert.equal(_.isEmpty(BaseModel.schema), true)

    })

  })

  describe('.attributes', () => {

    it('should return an array', () => {

      assert.equal(Array.isArray(BaseModel.attributes), true)

    })

    it('should return an empty array', () => {

      assert.equal(_.isEmpty(BaseModel.attributes), true)

    })

  })

  describe('.create()', () => {

    it('should return a function', () => {

      assert.equal(_.isFunction(BaseModel.create), true)
      assert.equal(BaseModel.create().constructor, BaseModel)
      assert.equal(BaseModel.create() instanceof BaseModel, true)
      assert.equal(BaseModel.create().constructor,
                   (new BaseModel()).constructor)

    })

  })

  describe('.destroy()', () => {

    it('should return a function', () => {

      assert.equal(_.isFunction(BaseModel.destroy), true)

    })

  })

  describe('.clone()', () => {

    var NewBaseModel

    before(() => {
      NewBaseModel = BaseModel.clone()
    })

    it('should not change the prototype', () => {

      assert.equal(Object.getPrototypeOf(NewBaseModel), BaseModel)

    })

    it('should return new object', () => {

      assert.notEqual(NewBaseModel, BaseModel)

    })

    it('should include same properties', () => {

      [
        'clone',
        'attach',
        'detach'
      ].forEach(p => {
        assert.equal(!!NewBaseModel[p], true)
      })

    })

  })

})
