'use strict'

import _pg from 'pg'

const pg = _pg.native

export default {

  connect(dsn) {
    return new Promise((resolve, reject) => {
      pg.connect(dsn, (err, client, done) => {
        if (err) return reject(err)
        resolve({ client, done })
      })
    })
  },

  ping(conn) {
    return conn.then(({ client, done }) => {
      return new Promise((resolve, reject) => {
        client.query('', err => {
          done()
          err ? reject(err) : resolve()
        })
      })
    })
  },

  exec(conn, sql = '', values) {
    return conn.then(({ client, done }) => {
      return new Promise((resolve, reject) => {
        console.log('   sql:', sql)
        console.log('values:', values)
        client.query(sql, values, (err, result) => {
          // release pool conn
          done(err)

          // throw err or response result
          err ? reject(err) : resolve(result)
        })
      })
    })
  }

}
