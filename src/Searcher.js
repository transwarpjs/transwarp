
export default class Searcher {

  constructor(db) {
    this.db = db
    this.columns = []
    this.whereClauses = []
  }

  clone() {
    const s = Object.create(this)
    s.columns = this.columns.slice()
    s.whereClauses = this.whereClauses.slice()
    return s
  }

  select(query, ...args) {
    this.columns.push({ query, args })
    return this
  }

  where(query, ...args) {
    this.whereClauses.push({ query, args })
    return this
  }

}
