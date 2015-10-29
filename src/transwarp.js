import Database from './Database'
import createDialect from './createDialect'

const drivers = Object.create(null)

function open(name, dataSourceName) {
  const driver = drivers[name]
  if (!driver) {
    throw new Error(`db: unknown driver ${name} (forgotten import?)`)
  }

  const db = new Database({
    dialect: createDialect(name),
    driver: Object.create(driver),
    dsn: dataSourceName
  })

  return db
}

function register(name, driver) {
  if (!driver) {
    throw new Error(`db: Register driver is null`)
  }
  if (drivers[name]) {
    throw new Error(`db: Register called twice for driver ${name}`)
  }

  Object.defineProperty(drivers, name, {
    enumerable: true,
    value: driver
  })
}

export default {

  drivers,

  open,

  register

}
