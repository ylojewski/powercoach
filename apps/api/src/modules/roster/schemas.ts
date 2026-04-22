import { Type, type Static } from '@sinclair/typebox'

export const COACH_SCHEMA_ID = 'Coach' as const
export const ORGANIZATION_SCHEMA_ID = 'Organization' as const
export const ATHLETE_SCHEMA_ID = 'Athlete' as const
export const ROSTER_RESPONSE_SCHEMA_ID = 'RosterResponse' as const

export const coachSchema = Type.Object(
  {
    email: Type.String({ format: 'email' }),
    firstName: Type.String(),
    id: Type.Number(),
    lastName: Type.String()
  },
  {
    $id: COACH_SCHEMA_ID,
    additionalProperties: false
  }
)

export const organizationSchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String()
  },
  {
    $id: ORGANIZATION_SCHEMA_ID,
    additionalProperties: false
  }
)

export const athleteSchema = Type.Object(
  {
    email: Type.String({ format: 'email' }),
    firstName: Type.String(),
    id: Type.Number(),
    lastName: Type.String(),
    organizationId: Type.Number()
  },
  {
    $id: ATHLETE_SCHEMA_ID,
    additionalProperties: false
  }
)

export const rosterQuerystringSchema = Type.Object(
  {
    organizationId: Type.Optional(Type.String({ pattern: '^[1-9]\\d*$' }))
  },
  {
    additionalProperties: false
  }
)

export const rosterResponseSchema = Type.Object(
  {
    athletes: Type.Array(Type.Ref(athleteSchema)),
    coach: Type.Ref(coachSchema),
    organizations: Type.Array(Type.Ref(organizationSchema))
  },
  {
    $id: ROSTER_RESPONSE_SCHEMA_ID,
    additionalProperties: false
  }
)

export function parseOrganizationId({ organizationId }: RosterQuerystring): number | undefined {
  return organizationId === undefined ? undefined : Number.parseInt(organizationId, 10)
}

export type Coach = Static<typeof coachSchema>
export type Organization = Static<typeof organizationSchema>
export type Athlete = Static<typeof athleteSchema>
export type RosterQuerystring = Static<typeof rosterQuerystringSchema>
export type RosterResponse = Static<typeof rosterResponseSchema>
