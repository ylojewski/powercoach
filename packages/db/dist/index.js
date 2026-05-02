import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { envSchema as envSchema$1, createEnvLoader } from '@powercoach/util-env';
import { z } from 'zod';
import { pgTable, text, serial, integer, primaryKey, foreignKey, timestamp, index, boolean, real, check, uniqueIndex } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var envSchema = envSchema$1.extend({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ })
});
var { loadEnv, resetCachedEnv } = createEnvLoader({
  format: /* @__PURE__ */ __name((error) => `Invalid environment: ${error.message}`, "format"),
  schema: envSchema
});

// src/client/createClient.ts
async function createClient(options) {
  const pg = new Client({
    connectionString: options?.databaseUrl ?? loadEnv().DATABASE_URL
  });
  try {
    await pg.connect();
  } catch (error) {
    console.error("\u274C Failed to connect to database:", error);
    throw error;
  }
  return {
    db: drizzle(pg),
    pg
  };
}
__name(createClient, "createClient");
var coaches = pgTable("coaches", {
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  id: serial("id").primaryKey(),
  lastName: text("last_name").notNull(),
  password: text("password").notNull()
});
var organizations = pgTable("organizations", {
  id: serial("id").primaryKey(),
  name: text("name").notNull()
});

// src/schema/coachOrganizations.ts
var coachOrganizations = pgTable(
  "coach_organizations",
  {
    coachId: integer("coach_id").notNull().references(() => coaches.id),
    organizationId: integer("organization_id").notNull().references(() => organizations.id)
  },
  (table) => [primaryKey({ columns: [table.coachId, table.organizationId] })]
);

// src/schema/athletes.ts
var athletes = pgTable(
  "athletes",
  {
    coachId: integer("coach_id").notNull().references(() => coaches.id),
    email: text("email").notNull().unique(),
    firstName: text("first_name").notNull(),
    id: serial("id").primaryKey(),
    lastName: text("last_name").notNull(),
    organizationId: integer("organization_id").notNull().references(() => organizations.id),
    password: text("password").notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.coachId, table.organizationId],
      foreignColumns: [coachOrganizations.coachId, coachOrganizations.organizationId],
      name: "athletes_coach_organization_fk"
    })
  ]
);
var archivedAt = timestamp("archived_at", { withTimezone: true });
var timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
};

// src/schema/disciplines.ts
var disciplines = pgTable("disciplines", {
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ...timestamps
});

// src/schema/athleteDisciplines.ts
var athleteDisciplines = pgTable(
  "athlete_disciplines",
  {
    athleteId: integer("athlete_id").notNull().references(() => athletes.id),
    disciplineId: integer("discipline_id").notNull().references(() => disciplines.id)
  },
  (table) => [
    index("athlete_disciplines_discipline_id_idx").on(table.disciplineId),
    primaryKey({ columns: [table.athleteId, table.disciplineId] })
  ]
);
var coachSettings = pgTable(
  "coach_settings",
  {
    coachId: integer("coach_id").notNull().references(() => coaches.id),
    defaultOrganizationId: integer("default_organization_id").notNull()
  },
  (table) => [
    foreignKey({
      columns: [table.coachId, table.defaultOrganizationId],
      foreignColumns: [coachOrganizations.coachId, coachOrganizations.organizationId],
      name: "coach_settings_default_organization_fk"
    }),
    primaryKey({ columns: [table.coachId] })
  ]
);
var loadingTypes = pgTable("loading_types", {
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ...timestamps
});

// src/schema/exercises.ts
var exercises = pgTable(
  "exercises",
  {
    archivedAt,
    bodyweightCoefficient: real("bodyweight_coefficient"),
    code: text("code").notNull().unique(),
    descriptionMarkdown: text("description_markdown"),
    id: serial("id").primaryKey(),
    imageUrl: text("image_url"),
    isSystem: boolean("is_system").notNull().default(false),
    isUnilateral: boolean("is_unilateral").notNull().default(false),
    loadingTypeId: integer("loading_type_id").references(() => loadingTypes.id),
    publicationStatus: text("publication_status").notNull().default("draft"),
    shortInstructionsMarkdown: text("short_instructions_markdown"),
    subtitle: text("subtitle"),
    title: text("title").notNull(),
    videoUrl: text("video_url"),
    ...timestamps
  },
  (table) => [
    check(
      "exercises_bodyweight_coefficient_range_check",
      sql`${table.bodyweightCoefficient} IS NULL OR (${table.bodyweightCoefficient} >= 0 AND ${table.bodyweightCoefficient} <= 1)`
    ),
    check(
      "exercises_publication_status_check",
      sql`${table.publicationStatus} IN ('draft', 'published')`
    ),
    index("exercises_archived_at_idx").on(table.archivedAt),
    index("exercises_loading_type_id_idx").on(table.loadingTypeId),
    index("exercises_publication_status_idx").on(table.publicationStatus)
  ]
);
var muscleRoles = pgTable("muscle_roles", {
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ...timestamps
});
var muscles = pgTable(
  "muscles",
  {
    chain: text("chain"),
    code: text("code").notNull().unique(),
    commonName: text("common_name"),
    description: text("description").notNull(),
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    parentMuscleId: integer("parent_muscle_id"),
    ...timestamps
  },
  (table) => [
    check(
      "muscles_chain_check",
      sql`${table.chain} IS NULL OR ${table.chain} IN ('anterior', 'posterior')`
    ),
    foreignKey({
      columns: [table.parentMuscleId],
      foreignColumns: [table.id],
      name: "muscles_parent_muscle_id_fk"
    }),
    index("muscles_parent_muscle_id_idx").on(table.parentMuscleId)
  ]
);

// src/schema/exerciseMuscles.ts
var exerciseMuscles = pgTable(
  "exercise_muscles",
  {
    exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
    muscleId: integer("muscle_id").notNull().references(() => muscles.id),
    muscleRoleId: integer("muscle_role_id").notNull().references(() => muscleRoles.id),
    weightPercentage: real("weight_percentage").notNull()
  },
  (table) => [
    check(
      "exercise_muscles_weight_percentage_range_check",
      sql`${table.weightPercentage} >= 0 AND ${table.weightPercentage} <= 100`
    ),
    index("exercise_muscles_muscle_id_muscle_role_id_idx").on(table.muscleId, table.muscleRoleId),
    primaryKey({ columns: [table.exerciseId, table.muscleId] })
  ]
);
var patterns = pgTable("patterns", {
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ...timestamps
});

// src/schema/exercisePatterns.ts
var exercisePatterns = pgTable(
  "exercise_patterns",
  {
    exerciseId: integer("exercise_id").notNull().references(() => exercises.id),
    patternId: integer("pattern_id").notNull().references(() => patterns.id)
  },
  (table) => [
    index("exercise_patterns_pattern_id_idx").on(table.patternId),
    primaryKey({ columns: [table.exerciseId, table.patternId] })
  ]
);
var exerciseRoles = pgTable("exercise_roles", {
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ...timestamps
});

// src/schema/exerciseRelationships.ts
var exerciseRelationships = pgTable(
  "exercise_relationships",
  {
    defaultTransferCoefficient: real("default_transfer_coefficient").notNull(),
    disciplineId: integer("discipline_id").notNull().references(() => disciplines.id),
    id: serial("id").primaryKey(),
    roleId: integer("role_id").notNull().references(() => exerciseRoles.id),
    sourceExerciseId: integer("source_exercise_id").notNull().references(() => exercises.id),
    targetExerciseId: integer("target_exercise_id").notNull().references(() => exercises.id),
    ...timestamps
  },
  (table) => [
    check(
      "exercise_relationships_default_transfer_coefficient_range_check",
      sql`${table.defaultTransferCoefficient} >= 0 AND ${table.defaultTransferCoefficient} <= 1`
    ),
    index("exercise_relationships_discipline_source_idx").on(
      table.disciplineId,
      table.sourceExerciseId
    ),
    index("exercise_relationships_target_role_transfer_idx").on(
      table.disciplineId,
      table.targetExerciseId,
      table.roleId,
      table.defaultTransferCoefficient
    ),
    index("exercise_relationships_role_id_idx").on(table.roleId),
    index("exercise_relationships_source_exercise_id_idx").on(table.sourceExerciseId),
    index("exercise_relationships_target_exercise_id_idx").on(table.targetExerciseId),
    uniqueIndex("exercise_relationships_discipline_source_target_unique").on(
      table.disciplineId,
      table.sourceExerciseId,
      table.targetExerciseId
    )
  ]
);
var metadata = pgTable("metadata", {
  id: serial("id").primaryKey(),
  key: text("key").notNull(),
  value: text("value").notNull()
});

export { archivedAt, athleteDisciplines, athletes, coachOrganizations, coachSettings, coaches, createClient, disciplines, envSchema, exerciseMuscles, exercisePatterns, exerciseRelationships, exerciseRoles, exercises, loadEnv, loadingTypes, metadata, muscleRoles, muscles, organizations, patterns, resetCachedEnv, timestamps };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map