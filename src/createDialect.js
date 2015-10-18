
export default function(dialect = '') {

  const D = require(`./dialects/${dialect}`)

  return new D()

}
