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

const mainExecute = (await import(`@/src/seeds/main`)).execute
const executedSeeds = ['main']

let additiveExecute: ((db: NodePgDatabase) => Promise<void>) | null = null

if (pullSlug && pullSlug !== 'main') {
  try {
    const path = `../src/seeds/${pullSlug}`
    additiveExecute = (await import(path)).execute
  } catch (error) {
    console.log(`ℹ️ No "${pullSlug}" additive seed found`)
  }
}

const { db, pg } = await createClient()

try {
  await mainExecute(db)

  if (additiveExecute) {
    await additiveExecute(db)
    executedSeeds.push(pullSlug)
  }

  const seed = executedSeeds.join('+')

  await db.insert(metadata).values({ key: 'seed', value: seed })
  await pg.end()
  console.log(`✅ Seed "${seed}" executed`)
} catch (error) {
  await pg.end()
  console.error(error)
  throw error
}
