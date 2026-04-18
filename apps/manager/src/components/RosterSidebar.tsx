import { Avatar, AvatarFallback, LogoIcon, Separator } from '@powercoach/ui'
import { type ReactElement } from 'react'
import { Link } from 'react-router'

import { RouterPath } from '@/src/constants'
import { useGetCurrentCoachContextQuery } from '@/src/store'
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
  const { data, isLoading } = useGetCurrentCoachContextQuery()

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

      {data && !isLoading && (
        <>
          {data.organizations.map((organization) => (
            <Link
              aria-label="Powercoach home"
              data-testid="roster-organization"
              key={organization.id}
              to={RouterPath.Home}
            >
              <RosterSidebarAvatar
                initials={getInitials(organization.name)}
                label={organization.name}
              />
            </Link>
          ))}
          <RosterSidebarSeparator />

          <Link aria-label="Powercoach home" to={RouterPath.Home} data-testid="roster-coach">
            <RosterSidebarAvatar
              initials={getInitials(`${data.coach.firstName} ${data.coach.lastName}`)}
              label={`${data.coach.firstName} ${data.coach.lastName}`}
            />
          </Link>
          <RosterSidebarSeparator />

          {data.athletes.map((athlete) => (
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
