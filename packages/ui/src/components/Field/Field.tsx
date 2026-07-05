import { FieldControl } from './components/FieldControl'
import { FieldDescription } from './components/FieldDescription'
import { FieldItem } from './components/FieldItem'
import { FieldLabel } from './components/FieldLabel'
import { FieldRoot } from './components/FieldRoot'
import { FieldValidity } from './components/FieldValidity'

export * from './components/FieldControl'
export * from './components/FieldDescription'
export * from './components/FieldItem'
export * from './components/FieldLabel'
export * from './components/FieldRoot'
export * from './components/FieldValidity'

export interface FieldNamespace {
  Control: typeof FieldControl
  Description: typeof FieldDescription
  Item: typeof FieldItem
  Label: typeof FieldLabel
  Root: typeof FieldRoot
  Validity: typeof FieldValidity
}

export const Field: FieldNamespace = {
  Control: FieldControl,
  Description: FieldDescription,
  Item: FieldItem,
  Label: FieldLabel,
  Root: FieldRoot,
  Validity: FieldValidity
}
