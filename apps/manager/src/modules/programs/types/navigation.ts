export interface ProgramsNavigation {
  programsIndex: () => string
}

declare module '@/core' {
  interface Navigation extends ProgramsNavigation {}
}

export {}
