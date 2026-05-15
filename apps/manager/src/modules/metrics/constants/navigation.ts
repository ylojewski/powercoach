import { type MetricsNavigation } from '../types'

export enum MetricsNavigationPath {
  Index = ''
}

export const metricsNavigation = {
  metricsIndex: () => MetricsNavigationPath.Index
} as const satisfies MetricsNavigation
