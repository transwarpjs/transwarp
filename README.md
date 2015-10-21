# transwrap (WIP)

ORM/ODM for Node.js.


## Database

## Model

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

  // Post's Schema
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

var spock = new User({
  name: 'Spock',
  age:  2337
})

```

### Basics CRUD


```js

spock.delete()

User.destory(spock)

User.destory(1) // By Primary Key
```
