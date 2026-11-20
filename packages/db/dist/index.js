import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { envSchema as envSchema$1, createEnvLoader } from '@powercoach/util-env';
import { z } from 'zod';
import { pgTable, text, serial, integer, primaryKey, foreignKey, customType, index, uniqueIndex, boolean, real, check } from 'drizzle-orm/pg-core';
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
var isoTimestamp = customType({
  dataType() {
    return "timestamp with time zone";
  },
  fromDriver(value) {
    return new Date(value).toISOString();
  }
});
var archivedAt = isoTimestamp("archived_at");
var timestamps = {
  createdAt: isoTimestamp("created_at").notNull().default(sql`now()`),
  updatedAt: isoTimestamp("updated_at").notNull().default(sql`now()`)
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
var disciplineMovements = pgTable(
  "discipline_movements",
  {
    code: text("code").notNull(),
    description: text("description").notNull(),
    disciplineId: integer("discipline_id").notNull().references(() => disciplines.id),
    id: serial("id").primaryKey(),
    name: text("name").notNull(),
    sortOrder: integer("sort_order").notNull()
  },
  (table) => [
    index("discipline_movements_discipline_id_idx").on(table.disciplineId),
    uniqueIndex("discipline_movements_discipline_id_code_unique").on(
      table.disciplineId,
      table.code
    ),
    uniqueIndex("discipline_movements_id_discipline_id_unique").on(table.id, table.disciplineId)
  ]
);
var loadingTypes = pgTable("loading_types", {
  code: text("code").notNull().unique(),
  description: text("description").notNull(),
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  ...timestamps
});
var patterns = pgTable("patterns", {
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
    patternId: integer("pattern_id").references(() => patterns.id),
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
    index("exercises_pattern_id_idx").on(table.patternId),
    index("exercises_publication_status_idx").on(table.publicationStatus)
  ]
);

// src/schema/athleteDisciplineMovements.ts
var athleteDisciplineMovements = pgTable(
  "athlete_discipline_movements",
  {
    athleteId: integer("athlete_id").notNull().references(() => athletes.id),
    disciplineId: integer("discipline_id").notNull().references(() => disciplines.id),
    disciplineMovementId: integer("discipline_movement_id").notNull().references(() => disciplineMovements.id),
    exerciseId: integer("exercise_id").notNull().references(() => exercises.id)
  },
  (table) => [
    foreignKey({
      columns: [table.athleteId, table.disciplineId],
      foreignColumns: [athleteDisciplines.athleteId, athleteDisciplines.disciplineId],
      name: "athlete_discipline_movements_athlete_discipline_fk"
    }),
    foreignKey({
      columns: [table.disciplineMovementId, table.disciplineId],
      foreignColumns: [disciplineMovements.id, disciplineMovements.disciplineId],
      name: "athlete_discipline_movements_movement_discipline_fk"
    }),
    index("athlete_discipline_movements_exercise_id_idx").on(table.exerciseId),
    index("athlete_discipline_movements_discipline_id_idx").on(table.disciplineId),
    primaryKey({ columns: [table.athleteId, table.disciplineMovementId] })
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
    targetDisciplineMovementId: integer("target_discipline_movement_id").notNull().references(() => disciplineMovements.id),
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
      table.targetDisciplineMovementId,
      table.roleId,
      table.defaultTransferCoefficient
    ),
    foreignKey({
      columns: [table.targetDisciplineMovementId, table.disciplineId],
      foreignColumns: [disciplineMovements.id, disciplineMovements.disciplineId],
      name: "exercise_relationships_target_discipline_movement_discipline_fk"
    }),
    index("exercise_relationships_role_id_idx").on(table.roleId),
    index("exercise_relationships_source_exercise_id_idx").on(table.sourceExerciseId),
    index("exercise_relationships_target_discipline_movement_id_idx").on(
      table.targetDisciplineMovementId
    ),
    uniqueIndex("exercise_relationships_discipline_source_target_unique").on(
      table.disciplineId,
      table.sourceExerciseId,
      table.targetDisciplineMovementId
    )
  ]
);
var metadata = pgTable("metadata", {
  id: serial("id").primaryKey(),
  key: text("key").notNull(),
  value: text("value").notNull()
});

export { archivedAt, athleteDisciplineMovements, athleteDisciplines, athletes, coachOrganizations, coachSettings, coaches, createClient, disciplineMovements, disciplines, envSchema, exerciseMuscles, exerciseRelationships, exerciseRoles, exercises, loadEnv, loadingTypes, metadata, muscleRoles, muscles, organizations, patterns, resetCachedEnv, timestamps };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map