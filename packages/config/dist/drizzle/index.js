var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/drizzle/buildConfig.ts
function buildConfig({ databaseUrl }) {
  return {
    dbCredentials: {
      url: databaseUrl
    },
    dialect: "postgresql",
    out: "./src/migrations",
    schema: "./src/schema"
  };
}
__name(buildConfig, "buildConfig");

export { buildConfig };
