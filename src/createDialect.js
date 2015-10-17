
export default function(dialect = '') {

  return require(`./dialects/${dialect}`)

}
