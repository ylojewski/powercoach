import { NodeEnv } from '@powercoach/util-env'
import { type LoggerOptions, stdSerializers } from 'pino'

export interface BuildLoggerOptions {
  level: LoggerOptions['level']
  nodeEnv: NodeEnv
}

export const redactedPaths: string[] = ['req.headers.authorization'] as const

export function buildLoggerOptions({ level, nodeEnv }: BuildLoggerOptions): LoggerOptions {
  const isDevelopment = nodeEnv === NodeEnv.development
  const isProduction = nodeEnv === NodeEnv.production
  const options: LoggerOptions = {
    level,
    serializers: {
      req: (req) => ({ ...stdSerializers.req(req), headers: req.headers }),
      res: (res) => ({ ...stdSerializers.res(res), headers: res.getHeaders() })
    }
  }

  if (!isProduction) {
    options.transport = {
      options: {
        colorize: true,
        translateTime: 'SYS:standard'
      },
      target: 'pino-pretty'
    }
  }

  if (!isDevelopment) {
    options.redact = {
      paths: redactedPaths
    }
  }

  return options
}
