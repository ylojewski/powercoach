import { type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { simpleGit } from 'simple-git'

import { createClient } from '@/src/client'
import { metadata } from '@/src/schema'

let pullSlug = process.env.PULL_SLUG ?? ''

if (!pullSlug) {
  pullSlug = (await simpleGit().branch()).current
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

let execute: ((db: NodePgDatabase) => Promise<void>) | null = null
let seed = ''

try {
  const path = `../src/seeds/${pullSlug}`
  execute = (await import(path)).execute
  seed = pullSlug
} catch (error) {
  console.log(`ℹ️ No "${pullSlug}" seeds found`)
}

if (!execute) {
  execute = (await import(`@/src/seeds/main`)).execute
  seed = 'main'
}

const { db, pg } = await createClient()

try {
  await execute(db)
  await db.insert(metadata).values({ key: 'seed', value: seed })
  await pg.end()
  console.log(`✅ Seed "${seed}" executed`)
} catch (error) {
  await pg.end()
  console.error(error)
  throw error
}
