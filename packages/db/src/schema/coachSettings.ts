import { foreignKey, integer, pgTable, primaryKey } from 'drizzle-orm/pg-core'

import { coaches } from './coaches'
import { coachOrganizations } from './coachOrganizations'

export const coachSettings = pgTable(
  'coach_settings',
  {
    coachId: integer('coach_id')
      .notNull()
      .references(() => coaches.id),
    defaultOrganizationId: integer('default_organization_id').notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.coachId, table.defaultOrganizationId],
      foreignColumns: [coachOrganizations.coachId, coachOrganizations.organizationId],
      name: 'coach_settings_default_organization_fk'
    }),
    primaryKey({ columns: [table.coachId] })
  ]
)
