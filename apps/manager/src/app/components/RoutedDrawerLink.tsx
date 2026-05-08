import { type ReactElement } from 'react'
import { Link, type LinkProps } from 'react-router'

import { useBackgroundLocationState } from '../hooks'

export function RoutedDrawerLink({ state, ...props }: LinkProps): ReactElement {
  const backgroundLocationState = useBackgroundLocationState()
  const resolvedState = {
    ...state,
    ...backgroundLocationState
  }
  return <Link state={resolvedState} {...props} />
}
