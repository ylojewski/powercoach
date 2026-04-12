import { LogoIcon } from '@powercoach/ui'
import { type ReactElement } from 'react'
import { Link } from 'react-router'

import { routerPaths } from '@/src/constants/router-paths'

export function RosterSidebar(): ReactElement {
  return (
    <aside className="flex h-screen shrink-0 flex-col p-4">
      <Link aria-label="Powercoach home" className="block" to={routerPaths.home}>
        <LogoIcon />
      </Link>
    </aside>
  )
}
