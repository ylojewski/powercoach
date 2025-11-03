import pino, { type DestinationStream, type LoggerOptions } from 'pino'

export interface BuildLoggerOptions {
  level: LoggerOptions['level']
  nodeEnv: string
  destination?: DestinationStream
}

export function buildLogger({ level, nodeEnv, destination }: BuildLoggerOptions) {
  const isDevLike = nodeEnv !== 'production'

  const options: LoggerOptions = {
    level,
    redact: {
      censor: '[REDACTED]',
      paths: [
        'req.headers.authorization',
        'req.headers.cookie',
        'req.headers.x-api-key',
        'req.headers["x-api-key"]',
        'req.headers.set-cookie',
        'req.headers["set-cookie"]',
        'req.body.password',
        'req.body.token',
        'req.body.access_token',
        'req.body.refresh_token',
        'res.headers.set-cookie',
        'res.headers["set-cookie"]'
      ]
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

  return pino(options, destination)
}
