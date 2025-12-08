import { type QueryResult, type QueryResultRow } from 'pg'

export function mockQueryResult<T extends QueryResultRow>(
  rows: T[],
  command = 'SELECT'
): QueryResult<T> {
  return {
    command,
    fields: [],
    oid: 0,
    rowCount: rows.length,
    rows
  }
}
