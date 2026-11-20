import { type ComponentType } from 'react'

import {
  LoadingCoverCascade,
  type LoadingCoverCascadeProps
} from './components/LoadingCoverCascade'
import { LoadingCoverLogo, type LoadingCoverLogoProps } from './components/LoadingCoverLogo'
import { LoadingCoverRoot, type LoadingCoverRootProps } from './components/LoadingCoverRoot'

export * from './components/LoadingCoverCascade'
export * from './components/LoadingCoverLogo'
export * from './components/LoadingCoverRoot'
export * as LoadingCover from './LoadingCover.parts'

export interface LoadingCoverNamespace {
  Cascade: typeof LoadingCoverCascade & ComponentType<LoadingCoverCascadeProps>
  Logo: typeof LoadingCoverLogo & ComponentType<LoadingCoverLogoProps>
  Root: typeof LoadingCoverRoot & ComponentType<LoadingCoverRootProps>
}
