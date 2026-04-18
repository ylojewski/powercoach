import { rm, writeFile } from 'node:fs/promises'

import { spyOnConsole } from '@powercoach/util-test'
import { simpleGit } from 'simple-git'
import { type MockedFunction, type MockedObject } from 'vitest'

import { metadata } from '@/src/schema'

declare global {
  var seedImported: boolean
  var seedExecuted: boolean
}

const SEED_DIR = './src/seeds' as const

const PULL_NAME = 'branch/test_000' as const
const PULL_SLUG = 'branch-test-000' as const
const BAD_PULL_SLUG = `bad-${PULL_SLUG}` as const

const SEED_FILE = `${SEED_DIR}/${PULL_SLUG}.ts` as const
const BAD_SEED_FILE = `${SEED_DIR}/${BAD_PULL_SLUG}.ts` as const

const SEED_CONTENT = `
  globalThis.seedImported = true
  export async function execute() {
    globalThis.seedExecuted = true
  }
`

const BAD_SEED_CONTENT = `
  globalThis.seedImported = true
  export async function execute() {
    globalThis.seedExecuted = true
    throw new Error('seedError')
  }
`

const simpleGitMock = simpleGit as MockedFunction<typeof simpleGit>
const metadataMock = metadata as MockedObject<typeof metadata>
const mainSeedExecuteMock = vi.fn()
const branchMock = vi.fn().mockImplementation(() => ({ current: PULL_NAME }))
const insertMock = vi.fn().mockImplementation(() => ({ values: valuesMock }))
const valuesMock = vi.fn()
const endMock = vi.fn()

vi.mock('simple-git', () => ({
  simpleGit: vi.fn().mockImplementation(() => ({
    branch: branchMock
  }))
}))

vi.mock('@/src/client', () => ({
  createClient: vi.fn().mockImplementation(() => ({
    db: { insert: insertMock },
    pg: { end: endMock }
  }))
}))

vi.mock('@/src/schema', () => ({
  metadata: {}
}))

vi.mock('@/src/seeds/main', () => ({
  execute: mainSeedExecuteMock
}))

spyOnConsole(['log', 'error'])

describe('seed', () => {
  beforeAll(async () => {
    await writeFile(SEED_FILE, SEED_CONTENT, 'utf-8')
    await writeFile(BAD_SEED_FILE, BAD_SEED_CONTENT, 'utf-8')
  })

  beforeEach(() => {
    vi.resetModules()
    vi.clearAllMocks()
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.stubGlobal('seedExecuted', false)
    vi.stubGlobal('seedImported', false)
  })

  afterAll(async () => {
    await rm(SEED_FILE, { force: true })
    await rm(BAD_SEED_FILE, { force: true })
  })

  it('uses simple-git when PULL_SLUG is not provided', async () => {
    await import('./seed')
    expect(simpleGitMock).toHaveBeenCalledOnce()
    expect(branchMock).toHaveBeenCalledOnce()
    expect(mainSeedExecuteMock).toHaveBeenCalledOnce()
    expect(valuesMock).toHaveBeenCalledExactlyOnceWith({ key: 'seed', value: `main+${PULL_SLUG}` })
  })

  it('executes the main seed before an additive branch seed', async () => {
    vi.stubEnv('PULL_SLUG', PULL_SLUG)
    await import('./seed')
    expect(simpleGitMock).not.toHaveBeenCalledOnce()
    expect(branchMock).not.toHaveBeenCalledOnce()
    expect(mainSeedExecuteMock).toHaveBeenCalledOnce()
    expect(globalThis.seedImported).toBe(true)
    expect(globalThis.seedExecuted).toBe(true)
    expect(insertMock).toHaveBeenCalledWith(metadataMock)
    expect(valuesMock).toHaveBeenCalledExactlyOnceWith({ key: 'seed', value: `main+${PULL_SLUG}` })
    expect(endMock).toHaveBeenCalledOnce()
  })

  describe('should execute only the main seed', () => {
    function expectOnlyMainSeed() {
      expect(simpleGitMock).not.toHaveBeenCalledOnce()
      expect(branchMock).not.toHaveBeenCalledOnce()
      expect(globalThis.seedImported).toBe(false)
      expect(globalThis.seedExecuted).toBe(false)
      expect(mainSeedExecuteMock).toHaveBeenCalledOnce()
      expect(insertMock).toHaveBeenCalledWith(metadataMock)
      expect(valuesMock).toHaveBeenCalledExactlyOnceWith({ key: 'seed', value: 'main' })
      expect(endMock).toHaveBeenCalledOnce()
    }

    it('when no additive branch seed is provided', async () => {
      vi.stubEnv('PULL_SLUG', 'not-found')
      await import('./seed')
      expectOnlyMainSeed()
    })

    it('when PULL_SLUG is "main"', async () => {
      vi.stubEnv('PULL_SLUG', 'main')
      await import('./seed')
      expectOnlyMainSeed()
    })
  })

  it('exits if a seed execution failed', async () => {
    vi.stubEnv('PULL_SLUG', BAD_PULL_SLUG)
    await expect(import('./seed')).rejects.toThrow(new Error('seedError'))
    expect(simpleGitMock).not.toHaveBeenCalledOnce()
    expect(branchMock).not.toHaveBeenCalledOnce()
    expect(mainSeedExecuteMock).toHaveBeenCalledOnce()
    expect(globalThis.seedImported).toBe(true)
    expect(globalThis.seedExecuted).toBe(true)
    expect(insertMock).not.toHaveBeenCalled()
    expect(valuesMock).not.toHaveBeenCalled()
    expect(endMock).toHaveBeenCalledOnce()
  })
})

export {}
