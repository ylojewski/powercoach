import { RevealAnimation } from './RevealAnimation'
import { SwitchAnimation } from './SwitchAnimation'

export * from './RevealAnimation'
export * from './SwitchAnimation'

export interface AnimationsNamespace {
  RevealAnimation: typeof RevealAnimation
  SwitchAnimation: typeof SwitchAnimation
}

export const Animations: AnimationsNamespace = {
  RevealAnimation,
  SwitchAnimation
}
