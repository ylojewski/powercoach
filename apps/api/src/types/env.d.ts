declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: 'development' | 'test' | 'production'
    HOST?: string
    PORT?: string
    LOG_LEVEL?: 'fatal' | 'error' | 'warn' | 'info' | 'debug' | 'trace' | 'silent'
  }
}
