import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
function buildConfig(importUrl, config) {
  const { exclude, globalSetup, include, setup } = config ?? {};
  const importPath = fileURLToPath(importUrl);
  const importDir = dirname(importPath);
  const globalSetupFile = globalSetup === true ? "test/globalSetup.ts" : globalSetup || "";
  const setupFile = setup === true ? "test/setup.ts" : setup || "";
  return {
    resolve: {
      alias: {
        "@/scripts": resolve(importDir, "scripts"),
        "@/src": resolve(importDir, "src"),
        "@/test": resolve(importDir, "test")
      }
    },
    test: {
      coverage: {
        exclude: [
          "src/**/index.{ts,tsx}",
          "src/**/*.test.{ts,tsx}",
          "src/**/*.d.ts",
          "test",
          ...exclude ?? []
        ],
        include: ["src/**/*.{ts,tsx}", ...include ?? []],
        provider: "v8",
        reporter: ["text", "json", "lcov"],
        reportsDirectory: "coverage",
        thresholds: {
          branches: 100,
          functions: 100,
          lines: 100,
          statements: 100
        }
      },
      globals: true,
      ...globalSetupFile && { globalSetup: [globalSetupFile] },
      ...setupFile && { setupFiles: [setupFile] }
    }
  };
}
__name(buildConfig, "buildConfig");

export { buildConfig };
