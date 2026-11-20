import { AvatarFallback } from './components/AvatarFallback'
import { AvatarImage } from './components/AvatarImage'
import { AvatarRoot } from './components/AvatarRoot'

export * from './components/AvatarFallback'
export * from './components/AvatarImage'
export * from './components/AvatarRoot'
export { type AvatarSize } from './constants/avatarRootVariants'
export { type ImageLoadingStatus } from '@base-ui/react/avatar'

export const Avatar = {
  Fallback: AvatarFallback,
  Image: AvatarImage,
  Root: AvatarRoot
}
