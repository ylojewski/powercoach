import { Drawer as BaseUiDrawer } from '@base-ui/react/drawer'
import { type ReactElement } from 'react'

export type BottomSheetDescriptionProps = BaseUiDrawer.Description.Props

export type BottomSheetDescriptionState = BaseUiDrawer.Description.State

export function BottomSheetDescription(props: BottomSheetDescriptionProps): ReactElement {
  return <BaseUiDrawer.Description {...props} />
}
