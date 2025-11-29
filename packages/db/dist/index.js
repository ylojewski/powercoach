import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { z } from 'zod';
import { config } from 'dotenv';
import { pgTable, uuid, varchar } from 'drizzle-orm/pg-core';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var dbEnvSchema = z.object({
  DATABASE_URL: z.string().url()
});

// src/config/parseConfig.ts
function parseDbConfig(config, format) {
  const result = dbEnvSchema.safeParse(config);
  if (!result.success) {
    throw new Error(format(result.error));
  }
  return result.data;
}
__name(parseDbConfig, "parseDbConfig");

// src/config/loadConfig.ts
var cachedConfig;
function loadDbConfig() {
  if (cachedConfig) {
    return cachedConfig;
  }
  config({ quiet: true });
  cachedConfig = parseDbConfig(
    process.env,
    (error) => `Invalid database configuration: ${error.message}`
  );
  return cachedConfig;
}
__name(loadDbConfig, "loadDbConfig");
function resetCachedDbConfig() {
  cachedConfig = void 0;
}
__name(resetCachedDbConfig, "resetCachedDbConfig");
var users = pgTable("users", {
  email: varchar("email", { length: 255 }).notNull().unique(),
  id: uuid("id").primaryKey().defaultRandom()
});

// src/client.ts
var fallbackUser = {
  email: "demo@power.coach",
  id: "00000000-0000-4000-8000-000000000000"
};
function createDb(config) {
  const resolvedConfig = config ? parseDbConfig(config, (error) => `Invalid database configuration: ${error.message}`) : loadDbConfig();
  const sql = neon(resolvedConfig.DATABASE_URL);
  return drizzle(sql, { schema: { users } });
}
__name(createDb, "createDb");
async function fetchFirstUser(db = createDb()) {
  const [user] = await db.select().from(users).limit(1);
  return user ?? fallbackUser;
}
__name(fetchFirstUser, "fetchFirstUser");

export { createDb, dbEnvSchema, fallbackUser, fetchFirstUser, loadDbConfig, parseDbConfig, resetCachedDbConfig, users };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map