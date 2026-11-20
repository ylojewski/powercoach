import { Animations, type AnimationsNamespace } from './animations'
import { Components, type ComponentsNamespace } from './components'

export * from './animations'
export * from './components'

export interface UiNamespace {
  Animations: AnimationsNamespace
  Components: ComponentsNamespace
}

export const Ui: UiNamespace = {
  Animations,
  Components
}
