import { LogoIcon, Separator } from '@powercoach/ui'
import { type ReactElement } from 'react'

import { RoutedDrawerLink, useRouterConfig } from '@/core'
import { RosterSidebar } from '@/modules/roster'

function SidebarSeparator(): ReactElement {
  return <Separator className="bg-gray-200 dark:bg-gray-700" />
}

export function Sidebar(): ReactElement {
  const { Exercises } = useRouterConfig()

  return (
    <aside className="flex min-h-screen w-15 shrink-0 flex-col items-center gap-4 pt-4">
      <RoutedDrawerLink
        aria-label="Powercoach exercises"
        data-testid="roster-logo"
        to={Exercises.Index}
      >
        <LogoIcon />
      </RoutedDrawerLink>
      <SidebarSeparator />
      <RosterSidebar renderSeparator={() => <SidebarSeparator />} />
    </aside>
  )
}
