var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/tsup/buildConfig.ts
function buildConfig(pkg, options) {
  const { main } = pkg;
  const dependencies = Object.keys(pkg.dependencies ?? {});
  const devDependencies = Object.keys(pkg.devDependencies ?? {});
  return {
    clean: true,
    dts: options?.dts ?? false,
    entry: [main],
    external: [...dependencies, ...devDependencies],
    format: ["esm"],
    keepNames: true,
    loader: { ".json": "copy" },
    minify: false,
    noExternal: [],
    outDir: "dist",
    sourcemap: true,
    splitting: false,
    target: "node20",
    treeshake: true,
    tsconfig: "./tsconfig.src.json"
  };
}
__name(buildConfig, "buildConfig");

export { buildConfig };
