export const routerPaths = {
  home: '/',
  metrics: '/metrics',
  notes: '/notes',
  programs: '/programs',
  reviews: '/reviews'
} as const

export const panelPaths = [
  routerPaths.programs,
  routerPaths.reviews,
  routerPaths.metrics,
  routerPaths.notes
] as const

export type PanelPath = (typeof panelPaths)[number]
