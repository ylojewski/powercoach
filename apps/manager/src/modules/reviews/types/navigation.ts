export interface ReviewsNavigation {
  reviewsIndex: () => string
}

declare module '@/core' {
  interface Navigation extends ReviewsNavigation {}
}

export {}
