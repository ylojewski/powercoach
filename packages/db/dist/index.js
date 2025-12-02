import { drizzle } from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { z } from 'zod';
import { config } from 'dotenv';
import { pgTable, text, serial } from 'drizzle-orm/pg-core';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/types/types.ts
var NodeEnv = /* @__PURE__ */ ((NodeEnv2) => {
  NodeEnv2["development"] = "development";
  NodeEnv2["production"] = "production";
  NodeEnv2["test"] = "test";
  return NodeEnv2;
})(NodeEnv || {});

// src/core/env/envSchema.ts
var envSchema = z.object({
  DATABASE_URL: z.url({ protocol: /^postgres(ql)?$/ }),
  NODE_ENV: z.enum(NodeEnv)
});

// src/core/env/parseEnv.ts
function parseEnv(config, format) {
  const result = envSchema.safeParse(config);
  if (!result.success) {
    throw new Error(format(result.error));
  }
  return result.data;
}
__name(parseEnv, "parseEnv");

// src/core/env/loadEnv.ts
var cachedEnv;
var initialNodeEnv = process.env.NODE_ENV;
function loadEnv() {
  if (cachedEnv) {
    return cachedEnv;
  }
  config({ quiet: true });
  cachedEnv = Object.freeze(
    parseEnv(process.env, (error) => `Invalid environment: ${error.message}`)
  );
  return cachedEnv;
}
__name(loadEnv, "loadEnv");
function resetCachedConfig() {
  if (initialNodeEnv !== "production" /* production */) {
    cachedEnv = void 0;
  }
}
__name(resetCachedConfig, "resetCachedConfig");

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

export { NodeEnv, createClient, envSchema, loadEnv, metadata, parseEnv, resetCachedConfig };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map