import process from 'node:process'

import { type HealthResponse } from './schemas'

export function getHealthStatus(): HealthResponse {
  return {
    live: true,
    ready: true,
    uptime: process.uptime()
  }
}
