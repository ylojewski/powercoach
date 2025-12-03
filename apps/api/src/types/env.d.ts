declare namespace NodeJS {
  interface ProcessEnv {
    HOST?: string
    LOG_LEVEL?: import('./types').LogLevel
    PORT?: string
  }
}
