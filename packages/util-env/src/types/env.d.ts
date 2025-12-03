declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV?: import('./types').NodeEnv
  }
}
