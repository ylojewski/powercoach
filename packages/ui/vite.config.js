import { buildConfig } from '@powercoach/config/vite'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'
import svgr from 'vite-plugin-svgr'

export default buildConfig(import.meta.url, {
  exclude: ['src/**/*.stories.tsx', 'src/coss'],
  lib: true,
  plugins: [
    svgr(),
    tailwindcss(),
    viteStaticCopy({
      targets: [{ dest: 'assets', rename: { stripBase: true }, src: 'src/assets/favicon-*.svg' }]
    })
  ]
})
