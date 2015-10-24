# transwarp (WIP)

ORM/ODM for Node.js.

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![Test coverage][coveralls-image]][coveralls-url]

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
    user:       User,

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

[npm-image]: https://img.shields.io/npm/v/transwarp.svg?style=flat-square
[npm-url]: https://npmjs.org/package/transwarp
[travis-image]: https://img.shields.io/travis/trekjs/transwarp/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/trekjs/transwarp
[coveralls-image]: https://img.shields.io/coveralls/trekjs/transwarp/master.svg?style=flat-square
[coveralls-url]: https://coveralls.io/r/trekjs/transwarp?branch=master
