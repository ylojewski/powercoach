import { Drawer, DrawerPopup } from '@powercoach/ui'
import {
  type ComponentProps,
  type PropsWithChildren,
  type ReactElement,
  type ReactNode,
  useEffect
} from 'react'

import { LoadingTransition } from '@/core'

import { useReferences } from '../hooks'

export interface ReferencesDrawerProps extends PropsWithChildren<ComponentProps<typeof Drawer>> {
  nestedDrawers?: ReactNode
}

export function ReferencesDrawer({
  children,
  nestedDrawers,
  open,
  ...props
}: ReferencesDrawerProps): ReactElement {
  const { load, loading } = useReferences()

  useEffect(() => {
    return open ? load() : undefined
  }, [load, open])

  return (
    <Drawer open={open} position="bottom" {...props}>
      <DrawerPopup showBar showCloseButton className="min-h-[calc(100dvh-4.75rem)] rounded-none">
        <LoadingTransition contained loading={loading}>
          {children}
        </LoadingTransition>
        {nestedDrawers}
      </DrawerPopup>
    </Drawer>
  )
}
