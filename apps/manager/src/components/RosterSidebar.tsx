import { Avatar, AvatarFallback, LogoIcon, Separator } from '@powercoach/ui'
import { type ReactElement } from 'react'
import { Link } from 'react-router'

import { RouterPath } from '@/src/constants'
import { useGetCurrentRosterQuery, useGetCurrentSettingsQuery } from '@/src/store'
import { getInitials } from '@/src/utils'

interface RosterSidebarAvatarProps {
  initials: string
  label: string
}

function RosterSidebarSeparator(): ReactElement {
  return <Separator className="bg-gray-200 dark:bg-gray-700" />
}

function RosterSidebarAvatar({ initials, label }: RosterSidebarAvatarProps): ReactElement {
  return (
    <Avatar
      aria-label={label}
      className="border-foreground bg-background ring-background size-8 rounded-none border ring-2 transition-shadow duration-150 ease-out hover:ring-3"
      role="img"
      title={label}
    >
      <AvatarFallback className="bg-foreground font-heading text-background rounded-none text-sm tracking-widest">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

export function RosterSidebar(): ReactElement {
  const rosterQuery = useGetCurrentRosterQuery({})
  const settingsQuery = useGetCurrentSettingsQuery()

  const data = {
    ...(rosterQuery.data && { roster: rosterQuery.data }),
    ...(settingsQuery.data && { settings: settingsQuery.data })
  }

  const isLoading = rosterQuery.isLoading && settingsQuery.isLoading

  const defaultOrganization = data.roster?.organizations.find(
    ({ id }) => id === data.settings?.defaultOrganizationId
  )

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
      <RosterSidebarSeparator />

      {data.roster && data.settings && !isLoading && (
        <>
          {defaultOrganization && (
            <Link
              aria-label="Powercoach home"
              data-testid="roster-organization"
              key={defaultOrganization.id}
              to={RouterPath.Home}
            >
              <RosterSidebarAvatar
                initials={getInitials(defaultOrganization.name)}
                label={defaultOrganization.name}
              />
            </Link>
          )}
          <RosterSidebarSeparator />

          <Link aria-label="Powercoach home" to={RouterPath.Home} data-testid="roster-coach">
            <RosterSidebarAvatar
              initials={getInitials(`${data.roster.coach.firstName} ${data.roster.coach.lastName}`)}
              label={`${data.roster.coach.firstName} ${data.roster.coach.lastName}`}
            />
          </Link>
          <RosterSidebarSeparator />

          {data.roster.athletes.map((athlete) => (
            <Link
              aria-label="Powercoach home"
              data-testid="roster-athlete"
              key={athlete.id}
              to={RouterPath.Home}
            >
              <RosterSidebarAvatar
                initials={getInitials(`${athlete.firstName} ${athlete.lastName}`)}
                label={`${athlete.firstName} ${athlete.lastName}`}
              />
            </Link>
          ))}
        </>
      )}
    </aside>
  )
}
