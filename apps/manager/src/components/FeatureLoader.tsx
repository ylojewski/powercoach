import { type PropsWithChildren, type ReactElement, useEffect } from 'react'

import { useFeatureLoader } from '@/src/hooks'

import { SplashScreen } from './SplashScreen'

export function FeatureLoader({ children }: PropsWithChildren): ReactElement {
  const featureLoader = useFeatureLoader()

  useEffect(() => {
    return featureLoader.load()
  }, [featureLoader.load])

  if (featureLoader.isLoading) {
    return <SplashScreen />
  }

  return <>{children}</>
}
