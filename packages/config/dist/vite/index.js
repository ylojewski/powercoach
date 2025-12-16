import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';
import dts from 'vite-plugin-dts';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
function buildConfig(importUrl, config) {
  const { exclude, globalSetup, include, lib, setup } = config ?? {};
  const importPath = fileURLToPath(importUrl);
  const importDir = dirname(importPath);
  const globalSetupFile = globalSetup === true ? "test/globalSetup.ts" : globalSetup || "";
  const setupFile = setup === true ? "test/setup.ts" : setup || "";
  const rootDir = lib ? "lib" : "src";
  return {
    resolve: {
      alias: {
        [`@/${rootDir}`]: resolve(importDir, rootDir),
        "@/scripts": resolve(importDir, "scripts"),
        "@/test": resolve(importDir, "test")
      }
    },
    test: {
      coverage: {
        exclude: [
          `${rootDir}/**/{index,main}.{ts,tsx}`,
          `${rootDir}/**/*.{test,spec}.{ts,tsx}`,
          `${rootDir}/**/*.d.ts`,
          "test",
          ...exclude ?? []
        ],
        include: [`${rootDir}/**/*.{ts,tsx}`, ...include ?? []],
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

// src/vite/buildConfig.ts
function buildConfig2(importUrl, config) {
  return defineConfig(({ mode }) => {
    const { api, lib } = config ?? {};
    const importPath = fileURLToPath(importUrl);
    const importDir = dirname(importPath);
    const apiTarget = api === true ? loadEnv(mode, importDir).VITE_API_BASE_URL ?? "" : api || "";
    const libFile = lib === true ? "lib/index.ts" : lib || "";
    const rootDir = libFile ? "lib" : "src";
    return {
      build: {
        ...libFile && {
          lib: {
            entry: resolve(importDir, libFile),
            fileName: "index",
            formats: ["es"]
          },
          rollupOptions: {
            external: ["react"],
            output: { globals: { react: "React" } }
          }
        },
        outDir: "dist",
        sourcemap: true
      },
      plugins: [
        react(),
        libFile && dts({ rollupTypes: true, tsconfigPath: "./tsconfig.lib.json" }) || null
      ],
      preview: {
        port: 4173,
        strictPort: true
      },
      resolve: {
        alias: {
          [`@/${rootDir}`]: resolve(importDir, rootDir),
          "@/scripts": resolve(importDir, "scripts"),
          "@/test": resolve(importDir, "test")
        }
      },
      server: {
        host: "localhost",
        port: 3e3,
        proxy: {
          ...api && {
            "/api": {
              changeOrigin: true,
              rewrite: /* @__PURE__ */ __name((path) => path.replace(/^\/api/, ""), "rewrite"),
              secure: false,
              target: apiTarget
            }
          }
        },
        strictPort: true
      },
      test: {
        ...buildConfig(importUrl, { ...config, lib: Boolean(config?.lib) }).test,
        environment: "jsdom"
      }
    };
  });
}
__name(buildConfig2, "buildConfig");

export { buildConfig2 as buildConfig };
