# transwrap (WIP)

ORM/ODM for Node.js.


### Database

### Model

#### Defines Model

```js

class User extends Model {

  static struct = {
    id: {
      type: 'integer'
    },

    createdAt: 'date',

    updatedAt: 'date',

    deletedAt: 'date'
  }

}

var user = new User({ name: 'Spock', ag: 233 })
user.save() // returns Promise Instalce
```
