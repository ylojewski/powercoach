import { InputAddOn } from './components/InputAddOn'
import { InputControl } from './components/InputControl'
import { InputRoot } from './components/InputRoot'

export * from './components/InputAddOn'
export * from './components/InputControl'
export * from './components/InputRoot'
export * from './types/InputTypes'

export interface InputNamespace {
  AddOn: typeof InputAddOn
  Control: typeof InputControl
  Root: typeof InputRoot
}

export const Input: InputNamespace = {
  AddOn: InputAddOn,
  Control: InputControl,
  Root: InputRoot
}
