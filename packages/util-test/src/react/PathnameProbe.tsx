import { type ReactElement } from 'react'
import { useLocation } from 'react-router'

export interface PathnameProbeProps {
  testId: string
}

export function PathnameProbe({ testId }: PathnameProbeProps): ReactElement {
  const location = useLocation()

  return <div data-testid={testId}>{location.pathname}</div>
}
