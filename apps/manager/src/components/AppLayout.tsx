import { type ReactElement } from 'react'
import { Outlet } from 'react-router'

export function AppLayout(): ReactElement {
  return <Outlet />
}
