import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
function buildConfig(importUrl, cfg) {
  const importPath = fileURLToPath(importUrl);
  const importDir = dirname(importPath);
  const globalSetup = cfg?.globalSetup === true ? "test/globalSetup.ts" : cfg?.globalSetup ?? "";
  const setup = cfg?.setup === true ? "test/setup.ts" : cfg?.setup ?? "";
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
          ...cfg?.exclude ?? []
        ],
        include: ["src/**/*.{ts,tsx}", ...cfg?.include ?? []],
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
      ...globalSetup && { globalSetup: [globalSetup] },
      ...setup && { setupFiles: [setup] }
    }
  };
}
__name(buildConfig, "buildConfig");

// src/vite/buildConfig.ts
function buildConfig2(importUrl, config) {
  const importPath = fileURLToPath(importUrl);
  const importDir = dirname(importPath);
  return {
    build: {
      outDir: "dist",
      sourcemap: true
    },
    plugins: [react()],
    preview: {
      port: 4173,
      strictPort: true
    },
    resolve: {
      alias: {
        "@/scripts": path.resolve(importDir, "./scripts"),
        "@/src": path.resolve(importDir, "./src"),
        "@/test": path.resolve(importDir, "./test")
      }
    },
    server: {
      host: "localhost",
      port: 3e3,
      strictPort: true
    },
    test: {
      ...buildConfig(importUrl, config).test,
      environment: "jsdom",
      setupFiles: ["test/setup.ts"]
    }
  };
}
__name(buildConfig2, "buildConfig");

export { buildConfig2 as buildConfig };
