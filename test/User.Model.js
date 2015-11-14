'use strict'

import _ from 'lodash'
import assert from 'assert'
import User from './fixtures/User'

describe('User Model', () => {

  describe('.schema', () => {

    it ('should return a schema object', () => {

      assert.equal(_.isPlainObject(User.schema), true)

    })

  })

  describe('.attributes', () => {

    it('should get all attributes from schema', () => {

      assert.deepEqual(User.attributes,
                       ['id', 'createdAt', 'updatedAt', 'deletedAt'])

    })

  })

})
