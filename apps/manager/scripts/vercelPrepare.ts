import { readFileSync, writeFileSync } from 'node:fs'

import { config } from 'dotenv'

config({ quiet: true })

const ENV_VARS = ['VITE_API_BASE_URL'] as const
const DEFAULT_ENV = {
  VITE_API_BASE_URL: 'http://localhost:8080'
} as const
let content = readFileSync('vercel.template.json', 'utf8')

for (const envVar of ENV_VARS) {
  const value = process.env[envVar] ?? DEFAULT_ENV[envVar]

  if (!value) {
    throw new Error(`process.env.${envVar} is not defined`)
  }

  content = content.replaceAll(`\${${envVar}}`, value)
}

writeFileSync('dist/vercel.json', content, 'utf8')

if (!process.argv.includes('--quiet')) {
  console.info('✅ dist/vercel.json')
}
