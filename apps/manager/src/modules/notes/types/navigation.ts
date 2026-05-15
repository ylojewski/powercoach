export interface NotesNavigation {
  notesIndex: () => string
}

declare module '@/core' {
  interface Navigation extends NotesNavigation {}
}

export {}
