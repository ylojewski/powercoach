import path, { dirname } from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
function buildConfig(importUrl) {
  const importPath = fileURLToPath(importUrl);
  const importDir = dirname(importPath);
  return {
    resolve: {
      alias: {
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
          "test"
        ],
        include: ["src/**/*.{ts,tsx}"],
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

// src/vite/buildConfig.ts
function buildConfig2(importUrl) {
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
        "@/src": path.resolve(importDir, "./src"),
        "@/test": path.resolve(importDir, "./test")
      }
    },
    server: {
      port: 3e3,
      strictPort: true
    },
    test: {
      ...buildConfig(importUrl).test,
      environment: "jsdom",
      setupFiles: ["test/setup.ts"]
    }
  };
}
__name(buildConfig2, "buildConfig");

export { buildConfig2 as buildConfig };
