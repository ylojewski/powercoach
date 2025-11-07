/** @type {import('tsup').Options} */
export const config = {
  format: ['esm'],
  outDir: 'dist',
  tsconfig: './tsconfig.src.json',
  treeshake: true,
  sourcemap: true,
  minify: false,
  dts: false,
  clean: true,
  splitting: false,
  target: 'node20',
  keepNames: true
}
