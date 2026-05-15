export interface MetricsNavigation {
  metricsIndex: () => string
}

declare module '@/core' {
  interface Navigation extends MetricsNavigation {}
}

export {}
