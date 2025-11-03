import { performance } from 'node:perf_hooks'
import process from 'node:process'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { getHealthStatus } from './service'

describe('getHealthStatus', () => {
  afterEach(() => {
    vi.useRealTimers()
  })

  it('returns ok=true with a non-negative uptime', () => {
    const result = getHealthStatus()

    expect(result.ok).toBe(true)
    expect(result.uptime).toBeGreaterThanOrEqual(0)
  })

  it('produces non-decreasing uptime values', () => {
    const uptimeMock = vi.spyOn(process, 'uptime').mockReturnValueOnce(10).mockReturnValueOnce(20)

    const first = getHealthStatus().uptime
    const second = getHealthStatus().uptime

    expect(second).toBeGreaterThanOrEqual(first)
    uptimeMock.mockRestore()
  })

  it('supports deterministic checks with fake timers', () => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2020-01-01T00:00:00Z'))
    const uptimeMock = vi
      .spyOn(process, 'uptime')
      .mockReturnValueOnce(123.456)
      .mockReturnValueOnce(150.789)

    const first = getHealthStatus()
    const second = getHealthStatus()

    expect(first).toEqual({ ok: true, uptime: 123.456 })
    expect(second.ok).toBe(true)
    expect(second.uptime).toBeGreaterThanOrEqual(first.uptime)
    expect(second.uptime).toBe(150.789)

    uptimeMock.mockRestore()
  })

  it('runs within an acceptable time budget', () => {
    const start = performance.now()
    getHealthStatus()
    const duration = performance.now() - start

    expect(duration).toBeLessThan(10)
  })
})
