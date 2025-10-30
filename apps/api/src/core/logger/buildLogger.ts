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
      censor: '[REDACTED]',
      paths: ['req.headers.authorization', 'req.headers.cookie']
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
