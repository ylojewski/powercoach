/** Routes owned by the application shell rather than by a feature module. */
export interface AppNavigation {
  index: () => string
}

declare module '@/core' {
  interface Navigation extends AppNavigation {}
}

export {}
