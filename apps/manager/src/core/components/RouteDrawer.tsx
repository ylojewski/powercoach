import { Drawer } from '@powercoach/ui'
import {
  cloneElement,
  type ReactElement,
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode
} from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router'

import { isBackgroundState } from '../types'

export interface RouteDrawerProps {
  children?: ReactNode
  drawer: ReactElement<ComponentProps<typeof Drawer>>
  fallbackPath: string
  path: string
}

export function RouteDrawer({
  children,
  drawer,
  fallbackPath,
  path
}: RouteDrawerProps): ReactElement {
  const { key, pathname, state } = useLocation()
  const navigate = useNavigate()
  const matches = Boolean(matchPath({ end: true, path: `${path === '/' ? '' : path}/*` }, pathname))
  const [open, setOpen] = useState<boolean>(matches)

  useEffect(() => {
    setOpen(matches)
  }, [key, matches])

  const onOpenChange = (open: boolean): void => {
    if (open) {
      return
    }

    setOpen(false)

    if (isBackgroundState(state)) {
      navigate(-1)
      return
    }

    navigate(fallbackPath)
  }

  return cloneElement(drawer, { onOpenChange, open }, children)
}
