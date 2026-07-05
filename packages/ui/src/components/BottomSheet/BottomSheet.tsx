import { BottomSheetBackdrop } from './components/BottomSheetBackdrop'
import { BottomSheetClose } from './components/BottomSheetClose'
import { BottomSheetContent } from './components/BottomSheetContent'
import { BottomSheetDescription } from './components/BottomSheetDescription'
import { BottomSheetPopup } from './components/BottomSheetPopup'
import { BottomSheetPortal } from './components/BottomSheetPortal'
import { BottomSheetRoot } from './components/BottomSheetRoot'
import { BottomSheetSurface } from './components/BottomSheetSurface'
import { BottomSheetTitle } from './components/BottomSheetTitle'
import { BottomSheetTrigger } from './components/BottomSheetTrigger'
import { BottomSheetViewport } from './components/BottomSheetViewport'

export * from './components/BottomSheetBackdrop'
export * from './components/BottomSheetClose'
export * from './components/BottomSheetContent'
export * from './components/BottomSheetDescription'
export * from './components/BottomSheetPopup'
export * from './components/BottomSheetPortal'
export * from './components/BottomSheetRoot'
export * from './components/BottomSheetSurface'
export * from './components/BottomSheetTitle'
export * from './components/BottomSheetTrigger'
export * from './components/BottomSheetViewport'

export interface BottomSheetNamespace {
  Backdrop: typeof BottomSheetBackdrop
  Close: typeof BottomSheetClose
  Content: typeof BottomSheetContent
  Description: typeof BottomSheetDescription
  Popup: typeof BottomSheetPopup
  Portal: typeof BottomSheetPortal
  Root: typeof BottomSheetRoot
  Surface: typeof BottomSheetSurface
  Title: typeof BottomSheetTitle
  Trigger: typeof BottomSheetTrigger
  Viewport: typeof BottomSheetViewport
}

export const BottomSheet: BottomSheetNamespace = {
  Backdrop: BottomSheetBackdrop,
  Close: BottomSheetClose,
  Content: BottomSheetContent,
  Description: BottomSheetDescription,
  Popup: BottomSheetPopup,
  Portal: BottomSheetPortal,
  Root: BottomSheetRoot,
  Surface: BottomSheetSurface,
  Title: BottomSheetTitle,
  Trigger: BottomSheetTrigger,
  Viewport: BottomSheetViewport
}
