# transwrap (WIP)

ORM/ODM for Node.js.


### Database

### Model

#### Defines Models

```js

class User extends Model {

  // User's Schema
  static schema = {

    id: {
      type:     'integer'
    },

    age:        'integer',
    username:   'string',

    createdAt:  'date',
    updatedAt:  'date',
    deletedAt:  'date'
  }

}

class Post extends Model {

  static schema = {

    id: {
      type:     'integer'
    },

    // One-To-One
    user: User,

    createdAt:  'date',
    updatedAt:  'date',
    deletedAt:  'date'

  }

}

```

### Creates an instance of Model

```js

var user = new User({
  name: 'Spock',
  age:  2337
})

```

### Basics CRUD
