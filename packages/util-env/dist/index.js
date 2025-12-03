import { config } from 'dotenv';
import { z } from 'zod';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/types/types.ts
var NodeEnv = /* @__PURE__ */ ((NodeEnv2) => {
  NodeEnv2["development"] = "development";
  NodeEnv2["production"] = "production";
  NodeEnv2["test"] = "test";
  return NodeEnv2;
})(NodeEnv || {});

// src/core/parseEnv.ts
function parseEnv(schema, config, format) {
  const result = schema.safeParse(config);
  if (!result.success) {
    throw new Error(format(result.error));
  }
  return result.data;
}
__name(parseEnv, "parseEnv");

// src/core/createEnvLoader.ts
function createEnvLoader({
  format,
  schema
}) {
  let cachedEnv;
  const initialNodeEnv = process.env.NODE_ENV;
  function loadEnv() {
    if (cachedEnv) {
      return cachedEnv;
    }
    config({ quiet: true });
    cachedEnv = Object.freeze(parseEnv(schema, process.env, format));
    return cachedEnv;
  }
  __name(loadEnv, "loadEnv");
  function resetCachedConfig() {
    if (initialNodeEnv !== "production" /* production */) {
      cachedEnv = void 0;
    }
  }
  __name(resetCachedConfig, "resetCachedConfig");
  return {
    loadEnv,
    resetCachedConfig
  };
}
__name(createEnvLoader, "createEnvLoader");
var envSchema = z.object({
  NODE_ENV: z.enum(NodeEnv)
});

export { NodeEnv, createEnvLoader, envSchema, parseEnv };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map