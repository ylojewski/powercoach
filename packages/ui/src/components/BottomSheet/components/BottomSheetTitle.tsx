import { Drawer as BaseUiDrawer } from '@base-ui/react/drawer'
import { type ReactElement } from 'react'

export type BottomSheetTitleProps = BaseUiDrawer.Title.Props

export type BottomSheetTitleState = BaseUiDrawer.Title.State

export function BottomSheetTitle(props: BottomSheetTitleProps): ReactElement {
  return <BaseUiDrawer.Title {...props} />
}
