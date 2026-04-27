import { type ReactElement } from 'react'
import { generatePath, Link } from 'react-router'

import { RouterPath } from '@/core'

import { useRosterFeature } from '../hooks'
import { getAthleteSlug, getInitials } from '../utils'
import { RosterSidebarAvatar } from './RosterSidebarAvatar'

export interface RosterSidebarProps {
  renderSeparator: () => ReactElement
}

export function RosterSidebar({ renderSeparator }: RosterSidebarProps): ReactElement {
  const { activatedAthlete, athletes, coach, defaultOrganization, status } = useRosterFeature()

  if (status !== 'ready') {
    return <></>
  }

  return (
    <>
      {defaultOrganization && (
        <>
          <Link
            aria-label="Powercoach organization"
            data-testid="roster-organization"
            key={defaultOrganization.id}
            to={RouterPath.Home}
          >
            <RosterSidebarAvatar
              initials={getInitials(defaultOrganization.name)}
              label={defaultOrganization.name}
            />
          </Link>
          {renderSeparator()}
        </>
      )}

      {coach && (
        <>
          <Link aria-label="Powercoach coach home" to={RouterPath.Home} data-testid="roster-coach">
            <RosterSidebarAvatar
              active={activatedAthlete === null}
              initials={getInitials(`${coach.firstName} ${coach.lastName}`)}
              label={`${coach.firstName} ${coach.lastName}`}
            />
          </Link>
          {renderSeparator()}
        </>
      )}

      {athletes.map((athlete) => (
        <Link
          aria-label="Powercoach athlete home"
          data-testid="roster-athlete"
          key={athlete.id}
          to={generatePath(RouterPath.AthleteHome, { athleteSlug: getAthleteSlug(athlete) })}
        >
          <RosterSidebarAvatar
            active={activatedAthlete?.id === athlete.id}
            initials={getInitials(`${athlete.firstName} ${athlete.lastName}`)}
            label={`${athlete.firstName} ${athlete.lastName}`}
          />
        </Link>
      ))}
    </>
  )
}
