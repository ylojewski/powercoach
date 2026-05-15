import { type ReviewsNavigation } from '../types'

export enum ReviewsNavigationPath {
  Index = ''
}

export const reviewsNavigation = {
  reviewsIndex: () => ReviewsNavigationPath.Index
} as const satisfies ReviewsNavigation
