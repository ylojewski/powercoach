import { Avatar, AvatarFallback } from '@powercoach/ui'
import { type ReactElement } from 'react'

export interface RosterSidebarAvatarProps {
  initials: string
  label: string
}

export function RosterSidebarAvatar({ initials, label }: RosterSidebarAvatarProps): ReactElement {
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
