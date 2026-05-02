import { sql } from 'drizzle-orm'
import { boolean, check, index, integer, pgTable, real, serial, text } from 'drizzle-orm/pg-core'

import { loadingTypes } from './loadingTypes'
import { archivedAt, timestamps } from './timestamps'

export const exercises = pgTable(
  'exercises',
  {
    archivedAt,
    bodyweightCoefficient: real('bodyweight_coefficient'),
    code: text('code').notNull().unique(),
    descriptionMarkdown: text('description_markdown'),
    id: serial('id').primaryKey(),
    imageUrl: text('image_url'),
    isSystem: boolean('is_system').notNull().default(false),
    isUnilateral: boolean('is_unilateral').notNull().default(false),
    loadingTypeId: integer('loading_type_id').references(() => loadingTypes.id),
    publicationStatus: text('publication_status').notNull().default('draft'),
    shortInstructionsMarkdown: text('short_instructions_markdown'),
    subtitle: text('subtitle'),
    title: text('title').notNull(),
    videoUrl: text('video_url'),
    ...timestamps
  },
  (table) => [
    check(
      'exercises_bodyweight_coefficient_range_check',
      sql`${table.bodyweightCoefficient} IS NULL OR (${table.bodyweightCoefficient} >= 0 AND ${table.bodyweightCoefficient} <= 1)`
    ),
    check(
      'exercises_publication_status_check',
      sql`${table.publicationStatus} IN ('draft', 'published')`
    ),
    index('exercises_archived_at_idx').on(table.archivedAt),
    index('exercises_loading_type_id_idx').on(table.loadingTypeId),
    index('exercises_publication_status_idx').on(table.publicationStatus)
  ]
)
