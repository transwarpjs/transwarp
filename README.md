# transwrap (WIP)

ORM/ODM for Node.js.


### Database

### Model

#### Defines a Model

```js

class User extends Model {

  static schema = {
    id: {
      type: 'integer'
    },

    createdAt: 'date',

    updatedAt: 'date',

    deletedAt: 'date'
  }

}

var user = new User({ name: 'Spock', ag: 233 })
user.save() // returns Promise Instance
```
