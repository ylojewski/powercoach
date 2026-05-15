export interface HomeNavigation {
  homeIndex: () => string
}

declare module '@/core' {
  interface Navigation extends HomeNavigation {}
}

export {}
