export interface HomeNavigation {
  homeDrawer: () => string
  homeIndex: () => string
}

/** Adds the routes owned by this module to the shared navigation contract. */
declare module '@/core' {
  interface Navigation extends HomeNavigation {}
}

export {}
