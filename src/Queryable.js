
export default class Queryable {

  select(...args) {
    const db = this.clone()
    db.searcher.select(...args)
    return db
    // return this.clone().searcher.select(...args).db
  }

  where(...args) {
    const db = this.clone()
    db.searcher.where(...args)
    return db
    // return this.clone().searcher.where(...args).db
  }

  group(...args) {
    const db = this.clone()
    db.searcher.group(...args)
    return db
    // return this.clone().searcher.grup(...args).db
  }

  limit(n) {
    const db = this.clone()
    db.searcher.limit(n)
    return db
    // return this.clone().searcher.limit(n).db
  }

  // offset
  skip(n) {
    const db = this.clone()
    db.searcher.skip(n)
    return db
    // return this.clone().searcher.skip(n).db
  }

  // order
  sort(...args) {
    const db = this.clone()
    db.searcher.sort(...args)
    return db
    // return this.clone().searcher.sort(...args).db
  }

  // Query Shorthands

  /*
  or(column, value) {
    const db = this.clone()
    db.searcher.where(column, 'OR', value)
    return db
  }
  */

  eq(column, value) {
    const db = this.clone()
    db.searcher.where(column, '=', value)
    return db
  }

  gt(column, value) {
    const db = this.clone()
    db.searcher.where(column, '>', value)
    return db
  }

  lt(column, value) {
    const db = this.clone()
    db.searcher.where(column, '<', value)
    return db
  }

  gte(column, value) {
    const db = this.clone()
    db.searcher.where(column, '>=', value)
    return db
  }

  lte(column, value) {
    const db = this.clone()
    db.searcher.where(column, '<=', value)
    return db
  }

  neq(column, value) {
    const db = this.clone()
    db.searcher.where(column, '<>', value)
    return db
  }

  like(column, value) {
    const db = this.clone()
    db.searcher.where(column, 'LIKE', quoteTag`${value}`)
    return db
  }

  ilike(column, value) {
    const db = this.clone()
    db.searcher.where(column, 'ILIKE', quoteTag`${value}`)
    return db
  }

  // (null, true, false)
  is(column, value) {
    const db = this.clone()
    db.searcher.where(column, 'IS', value)
    return db
  }

  isnot(column, value) {
    const db = this.clone()
    db.searcher.where(column, 'IS NOT', value)
    return db
  }

  // 1 IN (1,2,3,4)
  in(column, value) {
    const db = this.clone()
    db.searcher.where(column, 'IN', value)
    return db
  }

  // 1 NOT IN (1,2,3,4)
  notin(column, value) {
    const db = this.clone()
    db.searcher.where(column, 'NOT IN', value)
    return db
  }

}

function quoteTag(_, value) {
  return `'${value}'`
}
