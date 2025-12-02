import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
function buildConfig(importUrl, config) {
  const importPath = fileURLToPath(importUrl);
  const importDir = dirname(importPath);
  return {
    resolve: {
      alias: {
        "@/scripts": path.resolve(importDir, "./scripts"),
        "@/src": path.resolve(importDir, "./src"),
        "@/test": path.resolve(importDir, "./test")
      }
    },
    test: {
      coverage: {
        exclude: [
          "src/**/index.{ts,tsx}",
          "src/**/*.{test,spec}.{ts,tsx}",
          "src/**/*.d.ts",
          "test",
          ...config?.exclude ?? []
        ],
        include: ["src/**/*.{ts,tsx}", ...config?.include ?? []],
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
      globals: true
    }
  };
}
__name(buildConfig, "buildConfig");

export { buildConfig };
