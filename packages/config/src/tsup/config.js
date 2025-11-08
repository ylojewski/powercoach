/** @type {import('tsup').Options} */
export const config = {
  clean: true,
  dts: false,
  format: ['esm'],
  keepNames: true,
  minify: false,
  outDir: 'dist',
  sourcemap: true,
  splitting: false,
  target: 'node20',
  treeshake: true,
  tsconfig: './tsconfig.src.json'
}
