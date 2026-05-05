import { DRAWER_ANIMATION_DELAY, } from '@powercoach/ui'
import {
  useEffect,
  useState,
  type PropsWithChildren,
  type ReactElement,
  useMemo,
  Dispatch,
  SetStateAction
} from 'react'
import { useLocation } from 'react-router'

export interface UseRoutedDrawerTransitionProps extends PropsWithChildren {
  delay?: number
  pathname: string
}

export interface UseRoutedDrawerTransitionReturn extends PropsWithChildren {
  drawerTransitionOverlay: ReactElement | null
  isAnimating: boolean
  isPathnameMatching: boolean
  isOpened: boolean
  setIsOpened: Dispatch<SetStateAction<boolean>>
}

export function useRoutedDrawerTransition({
  delay = DRAWER_ANIMATION_DELAY,
  pathname
}: UseRoutedDrawerTransitionProps): UseRoutedDrawerTransitionReturn {
  const location = useLocation()
  const isPathnameMatching = location.pathname === pathname
  const [isOpened, setIsOpened] = useState<boolean>(isPathnameMatching)
  const [isAnimating, setIsAnimating] = useState(false)

  const drawerTransitionOverlay = useMemo(() => {
    if (!isPathnameMatching || !isAnimating) {
      return null
    }
    return <div aria-hidden className="fixed inset-0 z-[60]" />
  }, [isAnimating])

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
    isAnimating,
    isOpened,
    isPathnameMatching,
    setIsOpened
  }
}
