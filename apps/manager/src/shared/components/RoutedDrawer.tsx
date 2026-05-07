import { DRAWER_ANIMATION_DELAY, Drawer } from '@powercoach/ui'
import {
  type ComponentProps,
  type Dispatch,
  type ReactElement,
  type SetStateAction,
  useEffect,
  useMemo,
  useState
} from 'react'
import { matchPath, type To, useLocation, useNavigate, useResolvedPath } from 'react-router'

import { useBackgroundLocationState } from '../hooks'

interface RoutedDrawerProps extends Omit<ComponentProps<typeof Drawer>, 'onOpenChange' | 'open'> {
  closeTo: To
  matchDescendants?: boolean
  pathname?: string
}

interface UseRoutedDrawerTransitionProps {
  delay?: number
  matchDescendants: boolean
  pathname: string
}

interface UseRoutedDrawerTransitionResult {
  drawerTransitionOverlay: ReactElement | null
  isOpened: boolean
  setIsOpened: Dispatch<SetStateAction<boolean>>
}

function useRoutedDrawerTransition({
  delay = DRAWER_ANIMATION_DELAY,
  matchDescendants,
  pathname
}: UseRoutedDrawerTransitionProps): UseRoutedDrawerTransitionResult {
  const location = useLocation()
  const isPathnameMatching = matchDescendants
    ? location.pathname === pathname ||
      Boolean(matchPath({ end: true, path: `${pathname}/*` }, location.pathname))
    : Boolean(matchPath({ end: true, path: pathname }, location.pathname))
  const [isOpened, setIsOpened] = useState<boolean>(isPathnameMatching)
  const [isAnimating, setIsAnimating] = useState(false)

  const drawerTransitionOverlay = useMemo(() => {
    if (!isPathnameMatching || !isAnimating) {
      return null
    }
    return <div aria-hidden className="fixed inset-0 z-[60]" />
  }, [isAnimating, isPathnameMatching])

  useEffect(() => {
    setIsAnimating(true)
    const id = window.setTimeout(() => {
      setIsAnimating(false)
    }, delay)
    return () => {
      window.clearTimeout(id)
    }
  }, [delay, isOpened])

  useEffect(() => {
    setIsOpened(isPathnameMatching)
  }, [location.key, isPathnameMatching])

  return {
    drawerTransitionOverlay,
    isOpened,
    setIsOpened
  }
}

export function RoutedDrawer({
  closeTo,
  matchDescendants = false,
  pathname,
  ...drawerProps
}: RoutedDrawerProps): ReactElement {
  const navigate = useNavigate()
  const resolvedPath = useResolvedPath('.')
  const drawerPathname = pathname ?? resolvedPath.pathname
  const backgroundLocationState = useBackgroundLocationState()
  const { drawerTransitionOverlay, isOpened, setIsOpened } = useRoutedDrawerTransition({
    matchDescendants,
    pathname: drawerPathname
  })

  const handleOpenChange = (open: boolean): void => {
    if (open) {
      return
    }

    setIsOpened(false)
    if (backgroundLocationState?.backgroundLocation) {
      navigate(-1)
      return
    }

    navigate(closeTo)
  }

  return (
    <>
      {drawerTransitionOverlay}
      <Drawer onOpenChange={handleOpenChange} open={isOpened} {...drawerProps} />
    </>
  )
}
