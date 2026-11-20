import { Drawer as BaseUiDrawer } from '@base-ui/react/drawer'
import { type ReactElement } from 'react'

export type BottomSheetCloseProps = BaseUiDrawer.Close.Props

export type BottomSheetCloseState = BaseUiDrawer.Close.State

export function BottomSheetClose(props: BottomSheetCloseProps): ReactElement {
  return <BaseUiDrawer.Close {...props} />
}
