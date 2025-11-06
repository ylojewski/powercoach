import process from 'node:process'

import { type HealthResponse } from './schemas'

export function getHealthStatus(): HealthResponse {
  return {
    ok: true,
    uptime: process.uptime()
  }
}
