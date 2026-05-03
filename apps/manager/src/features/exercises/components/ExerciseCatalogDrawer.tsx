import {
  Drawer,
  DrawerCreateHandle,
  DrawerDescription,
  DrawerHeader,
  DrawerPanel,
  DrawerPopup,
  DrawerTitle
} from '@powercoach/ui'
import { type ReactElement, useCallback, useEffect, useMemo, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'

import { RouterPath } from '@/core'

import { ExerciseCatalog } from './ExerciseCatalog'

export interface ExerciseCatalogDrawerProps {
  closing?: boolean
  onClosed?: () => void
  onCloseNavigation?: () => void
}

export function ExerciseCatalogDrawer({
  closing = false,
  onClosed,
  onCloseNavigation
}: ExerciseCatalogDrawerProps): ReactElement {
  const { key } = useLocation()
  const navigate = useNavigate()
  const drawerHandle = useMemo(() => DrawerCreateHandle(), [])
  const openedRef = useRef(false)
  const navigateAfterCloseRef = useRef(false)
  const closingRef = useRef(closing)

  useEffect(() => {
    closingRef.current = closing
  }, [closing])

  useEffect(() => {
    if (closing) return undefined

    const animationFrame = window.requestAnimationFrame(() => {
      drawerHandle.open(null)
    })

    return () => {
      window.cancelAnimationFrame(animationFrame)
    }
  }, [closing, drawerHandle])

  useEffect(() => {
    if (!closing) return

    drawerHandle.close()
  }, [closing, drawerHandle])

  const handleOpenChange = useCallback((open: boolean): void => {
    if (open) {
      openedRef.current = true
    }

    navigateAfterCloseRef.current = !open
  }, [])

  const handleOpenChangeComplete = useCallback(
    (open: boolean): void => {
      if (open) {
        openedRef.current = true
        return
      }

      if (!openedRef.current || !navigateAfterCloseRef.current) return

      navigateAfterCloseRef.current = false

      if (closingRef.current) {
        onClosed?.()
        return
      }

      onCloseNavigation?.()

      if (key === 'default') {
        navigate(RouterPath.Home, { replace: true })
        return
      }

      navigate(-1)
    },
    [key, navigate, onClosed, onCloseNavigation]
  )

  return (
    <Drawer
      handle={drawerHandle}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={handleOpenChangeComplete}
      position="bottom"
    >
      <DrawerPopup className="[--drawer-height:calc(100svh-3rem)]" showBar variant="inset">
        <DrawerHeader>
          <DrawerTitle>Exercise catalog</DrawerTitle>
          <DrawerDescription>Browse and select exercises for programming.</DrawerDescription>
        </DrawerHeader>
        <DrawerPanel>
          <ExerciseCatalog />
        </DrawerPanel>
      </DrawerPopup>
    </Drawer>
  )
}
