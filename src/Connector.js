import createDialect from './createDialect'
import { open as openDatabase } from './transwrap'

class Connector {

  constructor({ dialect, source, logger, database, options }) {
    this.dialect = dialect
    this.source = source
    this.logger = logger
    this.options = options
    this.database = database
  }

  // alias database
  get db() {
    return this.database
  }

  /**
   * Connects the database
   *
   * @returns {Promise}
   */
  connect() {
    return this.db.connect()
  }

  /**
   * Closes the database
   *
   * @returns {Promise}
   */
  close() {}

  _clone() {
    const c = new Connector()
    return c
  }
}

function open(dialect, source, options) {

  const connector = new Connector({
    dialect: createDialect(dialect),
    source: source,
    options: options,
    database: openDatabase(dialect, source)
  })

  return connector
}

export default {

  Connector,

  open

}
