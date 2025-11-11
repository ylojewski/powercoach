import { readFileSync, writeFileSync } from 'node:fs'

import { config } from 'dotenv'

const ENV_VARS = ['VITE_API_BASE_URL'] as const

export function vercelPrepare() {
  config({ quiet: true })

  let content = readFileSync('vercel.template.json', 'utf8')

  for (const envVar of ENV_VARS) {
    if (!process.env[envVar]) {
      throw new Error(`process.env.${envVar} is not defined`)
    }
    content = content.replaceAll(`\${${envVar}}`, process.env[envVar])
  }

  writeFileSync('dist/vercel.json', content, 'utf8')
  console.info('✅ dist/vercel.json')
}

vercelPrepare()
