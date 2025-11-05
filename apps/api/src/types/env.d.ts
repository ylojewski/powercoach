declare namespace NodeJS {
  interface ProcessEnv {
    HOST?: string
    LOG_LEVEL?: import('./types').LogLevel
    NODE_ENV?: import('./types').NodeEnv
    PORT?: string
  }
}
