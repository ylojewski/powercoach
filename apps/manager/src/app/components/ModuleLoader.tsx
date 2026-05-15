import { type ReactElement, useEffect } from 'react'
import { Outlet } from 'react-router'

import { LoadingTransition } from '@/core'

import { ErrorScreen } from './ErrorScreen'
import { useModuleLoader } from '../hooks'

export function ModuleLoader(): ReactElement {
  const { load, status } = useModuleLoader()

  useEffect(() => {
    return load()
  }, [load])

  if (status === 'error') {
    return <ErrorScreen />
  }

  return (
    <LoadingTransition loading={status !== 'ready'}>
      <Outlet />
    </LoadingTransition>
  )
}
