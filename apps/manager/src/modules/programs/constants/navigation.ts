import { type ProgramsNavigation } from '../types'

export enum ProgramsNavigationPath {
  Index = ''
}

export const programsNavigation = {
  programsIndex: () => ProgramsNavigationPath.Index
} as const satisfies ProgramsNavigation
