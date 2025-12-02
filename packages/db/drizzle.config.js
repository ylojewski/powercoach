import { buildConfig } from '@powercoach/config/drizzle'

import { loadEnv } from './dist'

export default buildConfig({
  databaseUrl: loadEnv().DATABASE_URL
})
