export enum LOG_LEVEL {
  debug = 'debug',
  error = 'error',
  fatal = 'fatal',
  info = 'info',
  silent = 'silent',
  trace = 'trace',
  warn = 'warn'
}

export enum NODE_ENV {
  development = 'development',
  production = 'production',
  test = 'test'
}

declare namespace NodeJS {
  interface ProcessEnv {
    HOST?: string
    LOG_LEVEL?: LOG_LEVEL
    NODE_ENV?: NODE_ENV
    PORT?: string
  }
}
