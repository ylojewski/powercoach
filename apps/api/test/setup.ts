import process, { type ProcessEnv } from 'node:process'
import { afterEach, beforeEach, vi } from 'vitest'

let envSnapshot: ProcessEnv
let listenersSnapshot: Map<string | symbol, ((...args: unknown[]) => void)[]>

beforeEach(() => {
  envSnapshot = { ...process.env }
  listenersSnapshot = new Map()

  for (const event of process.eventNames()) {
    listenersSnapshot.set(event, process.listeners(event))
  }
})

afterEach(() => {
  vi.restoreAllMocks()
  vi.useRealTimers()

  for (const key of Object.keys(process.env)) {
    Reflect.deleteProperty(process.env, key)
  }

  for (const [key, value] of Object.entries(envSnapshot)) {
    if (value !== undefined) {
      process.env[key] = value
    }
  }

  for (const event of process.eventNames()) {
    for (const listener of process.listeners(event)) {
      process.removeListener(event, listener)
    }
  }

  for (const [event, listeners] of listenersSnapshot) {
    for (const listener of listeners) {
      process.on(
        event as Parameters<typeof process.on>[0],
        listener as Parameters<typeof process.on>[1]
      )
    }
  }
})
