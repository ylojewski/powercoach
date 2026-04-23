export const NEON_DATABASE_URL =
  'postgresql://user:password@region.neon.tech/neondb?sslmode=require' as const

export const POOLED_NEON_DATABASE_URL =
  'postgresql://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require' as const

export const TEST_DATABASE_URL =
  'postgres://test:test@localhost:55000/test_00000000-0000-4000-0000-000000000000' as const

export const LOCAL_DATABASE_URL =
  'postgres://postgres:postgres@localhost:5432/powercoach_dev' as const

export const INVALID_DATABASE_URL = 'invalid' as const

export const INVALID_DATABASE_URL_PROTOCOL =
  'postgr://postgres:postgres@localhost:5432/powercoach_dev' as const

export const UNKNOWN_DATABASE_URL_PROTOCOL =
  'postgre://user:password@pooler.region.neon.tech/neondb?sslmode=require&channel_binding=require' as const

export const PUBLIC_HOST = '0.0.0.0' as const
export const LOCAL_HOST = 'localhost' as const
export const INVALID_HOST = '256.256.256.256' as const

export const LOG_LEVEL_INFO = 'info' as const
export const LOG_LEVEL_DEBUG = 'debug' as const
export const INVALID_LOG_LEVEL = 'invalid' as const

export const DEFAULT_PORT = 8080 as const
export const TOO_BIG_PORT = 70000 as const

export const INVALID_NODE_ENV = 'invalid' as const
