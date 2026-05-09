import { type ReactElement } from 'react'
import { Link, type LinkProps, useLocation } from 'react-router'

import { type BackgroundLocationState, useBackgroundLocationState } from '../hooks'

export function RoutedDrawerLink({ state, ...props }: LinkProps): ReactElement {
  const resolvedState: BackgroundLocationState = {
    ...state,
    backgroundLocation: useBackgroundLocationState()?.backgroundLocation ?? useLocation()
  }
  return <Link state={resolvedState} {...props} />
}
