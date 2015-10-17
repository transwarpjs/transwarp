
export default class Database {

  constructor({ driver, dsn }) {
    this.driver = driver
    this.dsn = dsn

    Object.defineProperty(this.driver, 'db', {
      enumerable: false,
      configurable: false,
      writable: false,
      value: this
    })
  }

  connect() {
    return this.driver.connect()
  }

}
