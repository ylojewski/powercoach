import { integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { coaches } from './coaches'
import { organizations } from './organizations'

export const coachOrganizations = pgTable(
  'coach_organizations',
  {
    coachId: integer('coach_id')
      .notNull()
      .references(() => coaches.id),
    organizationId: integer('organization_id')
      .notNull()
      .references(() => organizations.id)
  },
  (table) => ({
    pk: primaryKey({ columns: [table.coachId, table.organizationId] })
  })
)
