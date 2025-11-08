/**
 * @param {{
 *   dependencies: Record<string, string>
 *   devDependencies: Record<string, string>
 *   main: string
 * }} pkg
 * @returns {import('tsup').Options}
 */
export function buildConfig(pkg) {
  const { main } = pkg
  const dependencies = Object.keys(pkg.dependencies)
  const devDependencies = Object.keys(pkg.devDependencies)

  return {
    clean: true,
    dts: false,
    entry: [main],
    external: [...dependencies, ...devDependencies],
    format: ['esm'],
    keepNames: true,
    minify: false,
    noExternal: [],
    outDir: 'dist',
    sourcemap: true,
    splitting: false,
    target: 'node20',
    treeshake: true,
    tsconfig: './tsconfig.src.json'
  }
}
