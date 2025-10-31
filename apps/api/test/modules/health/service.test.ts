import process from 'node:process'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getHealthStatus } from '../../../src/modules/health/service'

describe('getHealthStatus', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns the current uptime', () => {
    vi.spyOn(process, 'uptime').mockReturnValue(123.45)

    expect(getHealthStatus()).toEqual({ ok: true, uptime: 123.45 })
  })
})
