import { LogoIcon, Separator } from '@powercoach/ui'
import { type ReactElement } from 'react'

import { RosterSidebar } from '@/modules/roster'
import { RoutedDrawerLink } from '@/shared/components'

import { RouterPath } from '../constants'

function SidebarSeparator(): ReactElement {
  return <Separator className="bg-gray-200 dark:bg-gray-700" />
}

export function Sidebar(): ReactElement {
  return (
    <aside className="flex min-h-screen w-15 shrink-0 flex-col items-center gap-4 pt-4">
      <RoutedDrawerLink
        aria-label="Powercoach exercises"
        data-testid="roster-logo"
        to={RouterPath.Exercise}
      >
        <LogoIcon />
      </RoutedDrawerLink>
      <SidebarSeparator />
      <RosterSidebar renderSeparator={() => <SidebarSeparator />} />
    </aside>
  )
}
