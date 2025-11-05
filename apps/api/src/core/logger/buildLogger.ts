import { NodeEnv } from '@src/types'
import pino, { type LoggerOptions } from 'pino'

export interface BuildLoggerOptions {
  level: LoggerOptions['level']
  nodeEnv: NodeEnv
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
  const isDevLike = nodeEnv !== NodeEnv.production

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
