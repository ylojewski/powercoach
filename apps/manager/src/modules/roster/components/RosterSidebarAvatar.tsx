import { Avatar, AvatarFallback, cn } from '@powercoach/ui'
import { type ReactElement } from 'react'

export interface RosterSidebarAvatarProps {
  active?: boolean
  initials: string
  label: string
}

export function RosterSidebarAvatar({
  active = false,
  initials,
  label
}: RosterSidebarAvatarProps): ReactElement {
  const className = 'bg-foreground text-background'
  const activeClassName = 'bg-background text-foreground'

  return (
    <Avatar
      aria-label={label}
      className="size-8 rounded-none border border-background bg-background ring-2 ring-foreground transition-shadow duration-150 ease-out hover:ring-3 hover:ring-foreground"
      {...(active && { 'data-active': true })}
      role="img"
      title={label}
    >
      <AvatarFallback
        className={cn(
          active ? activeClassName : className,
          'rounded-none font-heading text-sm tracking-widest'
        )}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}
