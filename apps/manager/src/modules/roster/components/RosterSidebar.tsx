import { type ReactElement } from 'react'
import { Link } from 'react-router'

import { useNavigation } from '@/core'

import { useRoster } from '../hooks'
import { getAthleteSlug, getInitials } from '../utils'
import { RosterSidebarAvatar } from './RosterSidebarAvatar'

export interface RosterSidebarProps {
  renderSeparator: () => ReactElement
}

export function RosterSidebar({ renderSeparator }: RosterSidebarProps): ReactElement {
  const { activatedAthlete, athletes, coach, defaultOrganization, status } = useRoster()
  const navigation = useNavigation()

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
            to={navigation.index()}
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
          <Link
            aria-label="Powercoach coach home"
            data-testid="roster-coach"
            to={navigation.index()}
          >
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
          to={navigation.athleteIndex({ athleteSlug: getAthleteSlug(athlete) })}
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
