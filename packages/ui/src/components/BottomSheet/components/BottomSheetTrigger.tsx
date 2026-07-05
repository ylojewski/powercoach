import { Drawer as BaseUiDrawer } from '@base-ui/react/drawer'
import { type ReactElement } from 'react'

export type BottomSheetTriggerProps = Omit<BaseUiDrawer.Trigger.Props, 'handle' | 'payload'>

export type BottomSheetTriggerState = BaseUiDrawer.Trigger.State

export function BottomSheetTrigger(props: BottomSheetTriggerProps): ReactElement {
  return <BaseUiDrawer.Trigger {...props} handle={undefined} payload={undefined} />
}
