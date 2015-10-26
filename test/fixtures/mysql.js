import mysql from 'mysql'

export default {

  connect() {
    const dsn = this.db.dsn
    return new Promise((resolve, reject) => {
      mysql.createPool(dsn).getConnection((err, client, done) => {
        if (err) return reject(err)
        done = () => { client.release() }
        resolve({ client, done })
      })
    })
  }

}

