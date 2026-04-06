import { Logo, LogoIcon } from '@powercoach/ui'
import { type ReactElement } from 'react'
import { Outlet } from 'react-router'

export function AppLayout(): ReactElement {
  return (
    <div className="flex flex-col gap-2 m-2">
      <div className="flex gap-2">
        <LogoIcon />
        <Logo />
      </div>

      <Outlet />
    </div>
  )
}
