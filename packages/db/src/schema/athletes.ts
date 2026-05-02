import { foreignKey, integer, pgTable, serial, text } from 'drizzle-orm/pg-core'

import { coaches } from './coaches'
import { coachOrganizations } from './coachOrganizations'
import { organizations } from './organizations'

export const athletes = pgTable(
  'athletes',
  {
    coachId: integer('coach_id')
      .notNull()
      .references(() => coaches.id),
    email: text('email').notNull().unique(),
    firstName: text('first_name').notNull(),
    id: serial('id').primaryKey(),
    lastName: text('last_name').notNull(),
    organizationId: integer('organization_id')
      .notNull()
      .references(() => organizations.id),
    password: text('password').notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.coachId, table.organizationId],
      foreignColumns: [coachOrganizations.coachId, coachOrganizations.organizationId],
      name: 'athletes_coach_organization_fk'
    })
  ]
)
