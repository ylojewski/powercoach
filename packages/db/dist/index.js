import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { envSchema as envSchema$1, createEnvLoader } from '@powercoach/util-env';
import { z } from 'zod';
import { pgTable, text, serial } from 'drizzle-orm/pg-core';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var envSchema = envSchema$1.extend({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ })
});
var { loadEnv, resetCachedConfig } = createEnvLoader({
  format: /* @__PURE__ */ __name((error) => `Invalid environment: ${error.message}`, "format"),
  schema: envSchema
});

// src/client/createClient.ts
async function createClient() {
  const { DATABASE_URL } = loadEnv();
  const pg = new Client({
    connectionString: DATABASE_URL
  });
  try {
    await pg.connect();
  } catch (error) {
    console.error("\u274C Failed to connect to database:", error);
    throw error;
  }
  const db = drizzle(pg);
  return {
    db,
    pg
  };
}
__name(createClient, "createClient");
var metadata = pgTable("metadata", {
  id: serial("id").primaryKey(),
  key: text("key").notNull(),
  value: text("value").notNull()
});

export { createClient, envSchema, loadEnv, metadata, resetCachedConfig };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map