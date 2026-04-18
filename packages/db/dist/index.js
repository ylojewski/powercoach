import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { envSchema as envSchema$1, createEnvLoader } from '@powercoach/util-env';
import { z } from 'zod';
import { pgTable, text, serial, integer, primaryKey } from 'drizzle-orm/pg-core';

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

// src/schema/athletes.ts
var athletes = pgTable("athletes", {
  coachId: integer("coach_id").notNull().references(() => coaches.id),
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
  (table) => ({
    pk: primaryKey({ columns: [table.coachId, table.organizationId] })
  })
);
var metadata = pgTable("metadata", {
  id: serial("id").primaryKey(),
  key: text("key").notNull(),
  value: text("value").notNull()
});

export { athletes, coachOrganizations, coaches, createClient, envSchema, loadEnv, metadata, organizations, resetCachedEnv };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map