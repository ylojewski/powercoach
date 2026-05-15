import { LogoIcon, Separator } from '@powercoach/ui'
import { type ReactElement } from 'react'

import { BackgroundLink, useNavigation } from '@/core'
import { RosterSidebar } from '@/modules/roster'

function SidebarSeparator(): ReactElement {
  return <Separator className="bg-gray-200 dark:bg-gray-700" />
}

export function Sidebar(): ReactElement {
  const navigation = useNavigation()

  return (
    <aside className="flex min-h-screen w-15 shrink-0 flex-col items-center gap-4 pt-4">
      <BackgroundLink
        aria-label="Powercoach exercises"
        data-testid="roster-logo"
        to={navigation.exerciseIndex()}
      >
        <LogoIcon />
      </BackgroundLink>
      <SidebarSeparator />
      <RosterSidebar renderSeparator={() => <SidebarSeparator />} />
    </aside>
  )
}
