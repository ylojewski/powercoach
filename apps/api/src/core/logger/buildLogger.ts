import pino, { type LoggerOptions } from 'pino'
import { NODE_ENV } from '@/types/env.d'

export interface BuildLoggerOptions {
  level: LoggerOptions['level']
  nodeEnv: NODE_ENV
}

export const censoredPaths: string[] = [
  'req.headers.authorization',
  'req.headers.cookie',
  'req.body.password',
  'req.body.token',
  'req.body.refreshToken',
  'req.query.*token*',
  'res.headers.set-cookie'
] as const

export function buildLogger({ level, nodeEnv }: BuildLoggerOptions) {
  const isDevLike = nodeEnv !== NODE_ENV.production

  const options: LoggerOptions = {
    level,
    redact: {
      censor: '[REDACTED]',
      paths: censoredPaths
    }
  }

  if (isDevLike) {
    options.transport = {
      options: {
        colorize: true,
        translateTime: 'SYS:standard'
      },
      target: 'pino-pretty'
    }
  }

  return pino(options)
}
