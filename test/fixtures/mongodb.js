import mongodb from 'mongodb'

const MongoClient = mongodb.MongoClient

export default {

  connect() {
    const dsn = this.db.dsn
    return new Promise((resolve, reject) => {
      MongoClient.connect(dsn, (err, client, done) => {
        if (err) return reject(err)
        done = () => { client.close() }
        resolve({ client, done })
      })
    })
  }

}
