import { type HealthResponse } from './schemas'

export function getHealthStatus(): HealthResponse {
  return {
    live: true,
    ready: true,
    uptime: 42
  }
}
