import { expect } from 'vitest'
import type { LightMyRequestResponse } from 'fastify'

function normalizeHeaderName(name: string) {
  return name.toLowerCase()
}

export function expectHasHeader(response: LightMyRequestResponse, name: string) {
  const headerName = normalizeHeaderName(name)
  const value = response.headers[headerName]
  expect(value, `Expected header ${name} to be present`).toBeDefined()
  if (Array.isArray(value)) {
    expect(value.length).toBeGreaterThan(0)
  } else {
    expect(String(value).length).toBeGreaterThan(0)
  }
}

export function expectHeaderEquals(response: LightMyRequestResponse, name: string, value: string) {
  const headerName = normalizeHeaderName(name)
  expect(response.headers[headerName]).toBe(value)
}
