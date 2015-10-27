import pg from 'pg'

export default {

  connect() {
    const dsn = this.db.dsn
    return new Promise((resolve, reject) => {
      pg.connect(dsn, (err, client, done) => {
        if (err) return reject(err)
        resolve({ client, done })
      })
    })
  },

  ping() {
    return this.connect().then(({ client, done }) => {
      return new Promise((resolve, reject) => {
        client.query('', err => {
          done()
          err ? reject(err) : resolve()
        })
      })
    })
  }

}
