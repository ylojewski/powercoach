import { Drawer } from '@powercoach/ui'
import { type ComponentProps, type ReactElement, useEffect, useState } from 'react'
import { matchPath, useLocation, useNavigate } from 'react-router'

import { useBackgroundLocationState } from '../hooks'

export interface RoutedDrawerProps
  extends Omit<ComponentProps<typeof Drawer>, 'onOpenChange' | 'open'> {
  fallbackPathname: string
  matchDescendants?: boolean
  pathname: string
}

export function RoutedDrawer({
  fallbackPathname,
  matchDescendants = true,
  pathname,
  ...props
}: RoutedDrawerProps): ReactElement {
  const location = useLocation()
  const navigate = useNavigate()
  const backgroundLocationState = useBackgroundLocationState()
  const isPathnameMatching = matchDescendants
    ? location.pathname === pathname ||
      Boolean(matchPath({ end: true, path: `${pathname}/*` }, location.pathname))
    : Boolean(matchPath({ end: true, path: pathname }, location.pathname))
  const [isOpened, setIsOpened] = useState<boolean>(isPathnameMatching)

  useEffect(() => {
    setIsOpened(isPathnameMatching)
  }, [location.key, isPathnameMatching])

  const handleOpenChange = (open: boolean): void => {
    if (open) {
      return
    }

    setIsOpened(false)

    if (backgroundLocationState?.backgroundLocation) {
      navigate(-1)
      return
    }

    navigate(fallbackPathname)
  }

  return <Drawer onOpenChange={handleOpenChange} open={isOpened} {...props} />
}
