import { type ReactElement, useEffect } from 'react'
import { Outlet } from 'react-router'

import { ErrorScreen } from './ErrorScreen'
import { LoadingScreen } from './LoadingScreen'
import { useFeatureLoader } from '../hooks'

export function FeatureLoader(): ReactElement {
  const { load, status } = useFeatureLoader()

  useEffect(() => {
    return load()
  }, [load])

  if (status === 'error') {
    return <ErrorScreen />
  }

  if (status !== 'ready') {
    return <LoadingScreen />
  }

  return <Outlet />
}
