import { sql } from 'drizzle-orm'
import { customType } from 'drizzle-orm/pg-core'

const isoTimestamp = customType<{ data: string; driverData: string }>({
  dataType() {
    return 'timestamp with time zone'
  },
  fromDriver(value: string): string {
    return new Date(value).toISOString()
  }
})

export const archivedAt = isoTimestamp('archived_at')

export const timestamps = {
  createdAt: isoTimestamp('created_at')
    .notNull()
    .default(sql`now()`),
  updatedAt: isoTimestamp('updated_at')
    .notNull()
    .default(sql`now()`)
}
