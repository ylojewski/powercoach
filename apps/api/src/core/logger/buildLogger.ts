import pino, { type LoggerOptions } from 'pino'

export interface BuildLoggerOptions {
  level: LoggerOptions['level']
  nodeEnv: string
}

export function buildLogger({ level, nodeEnv }: BuildLoggerOptions) {
  const isDevLike = nodeEnv !== 'production'

  const options: LoggerOptions = {
    level,
    redact: {
      paths: ['req.headers.authorization', 'req.headers.cookie'],
      censor: '[REDACTED]'
    }
  }

  if (isDevLike) {
    options.transport = {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'SYS:standard'
      }
    }
  }

  return pino(options)
}
