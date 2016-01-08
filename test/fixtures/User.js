'use strict'

import Model from '../../src/Model'

export default class User extends Model {

  static schema = {

    id: {
      type: 'integer'
    },

    createdAt: 'date',

    updatedAt: 'date',

    deletedAt: 'date'

  };

}
