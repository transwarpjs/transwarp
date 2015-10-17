import _ from 'lodash'
import assert from 'assert'
import User from './fixtures/User'

describe('User Model', () => {

  describe('#struct', () => {

    it ('should return an struct object', () => {

      assert.equal(_.isPlainObject(User.struct), true)

    })

  })

  describe('#attributes', () => {

    it('should get all attributes from schema', () => {

      assert.deepEqual(User.attributes, ['id', 'createdAt', 'updatedAt', 'deletedAt'])

    })

  })

})
