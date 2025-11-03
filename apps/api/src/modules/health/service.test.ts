import { performance } from 'node:perf_hooks'
import process from 'node:process'
import { describe, expect, it, vi } from 'vitest'
import { getHealthStatus } from './service'

describe('getHealthStatus', () => {
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
    const uptimeMock = vi.spyOn(process, 'uptime').mockReturnValue(123.456)

    const status = getHealthStatus()

    expect(status).toEqual({ ok: true, uptime: 123.456 })
    uptimeMock.mockRestore()
    vi.useRealTimers()
  })

  it('runs within an acceptable time budget', () => {
    const start = performance.now()
    getHealthStatus()
    const duration = performance.now() - start

    expect(duration).toBeLessThan(10)
  })
})
