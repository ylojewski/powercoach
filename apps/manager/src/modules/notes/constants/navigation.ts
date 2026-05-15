import { type NotesNavigation } from '../types'

export enum NotesNavigationPath {
  Index = ''
}

export const notesNavigation = {
  notesIndex: () => NotesNavigationPath.Index
} as const satisfies NotesNavigation
