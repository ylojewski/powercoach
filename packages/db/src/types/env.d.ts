declare namespace NodeJS {
  interface ProcessEnv {
    DATABASE_URL?: string
    NODE_ENV?: import('./types').NodeEnv
  }
}
