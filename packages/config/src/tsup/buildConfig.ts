import { type Options } from 'tsup'

interface PackageJson {
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  main: string
}

export function buildConfig(pkg: PackageJson): Options {
  const { main } = pkg
  const dependencies = Object.keys(pkg.dependencies ?? {})
  const devDependencies = Object.keys(pkg.devDependencies ?? {})

  return {
    clean: true,
    dts: false,
    entry: [main],
    external: [...dependencies, ...devDependencies],
    format: ['esm'],
    keepNames: true,
    loader: { '.json': 'copy' },
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
