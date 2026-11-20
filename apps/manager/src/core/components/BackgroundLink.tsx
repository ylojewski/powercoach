import { type ReactElement } from 'react'
import { Link, type LinkProps } from 'react-router'

import { useBackgroundLocation, useBackgroundParams } from '../hooks'
import { type BackgroundState } from '../types'

export function BackgroundLink({ state, ...props }: LinkProps): ReactElement {
  const location = useBackgroundLocation()
  const params = useBackgroundParams()
  const resolvedState: BackgroundState = { ...state, location, params }

  return <Link state={resolvedState} {...props} />
}
