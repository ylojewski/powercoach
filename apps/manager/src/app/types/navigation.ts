export interface AppNavigation {
  athleteIndex: (params: { athleteSlug: string }) => string
  index: () => string
}

declare module '@/core' {
  interface Navigation extends AppNavigation {}
}

export {}
