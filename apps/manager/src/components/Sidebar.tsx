import { LogoIcon, Separator } from '@powercoach/ui'
import { type ReactElement } from 'react'
import { Link } from 'react-router'

import { RouterPath } from '@/src/constants'
import { RosterSidebar } from '@/src/features'

function SidebarSeparator(): ReactElement {
  return <Separator className="bg-gray-200 dark:bg-gray-700" />
}

export function Sidebar(): ReactElement {
  return (
    <aside className="flex h-screen shrink-0 flex-col items-center gap-4">
      <Link
        aria-label="Powercoach home"
        className="mt-4 px-3"
        data-testid="roster-logo"
        to={RouterPath.Home}
      >
        <LogoIcon />
      </Link>
      <SidebarSeparator />
      <RosterSidebar renderSeparator={() => <SidebarSeparator />} />
    </aside>
  )
}
