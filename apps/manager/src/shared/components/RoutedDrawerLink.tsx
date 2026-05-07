import { type ReactElement } from 'react'
import { Link, type LinkProps, useLocation } from 'react-router'

import { useBackgroundLocationState } from '../hooks'

export type RoutedDrawerLinkProps = Omit<LinkProps, 'state'>

export function RoutedDrawerLink(props: RoutedDrawerLinkProps): ReactElement {
  const location = useLocation()
  const backgroundLocationState = useBackgroundLocationState()

  return <Link state={backgroundLocationState ?? { backgroundLocation: location }} {...props} />
}
