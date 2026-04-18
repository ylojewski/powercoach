import { Type, type Static } from '@sinclair/typebox'

export const COACH_SUMMARY_SCHEMA_ID = 'CoachSummary' as const
export const ORGANIZATION_SUMMARY_SCHEMA_ID = 'OrganizationSummary' as const
export const ATHLETE_SUMMARY_SCHEMA_ID = 'AthleteSummary' as const
export const COACH_CONTEXT_RESPONSE_SCHEMA_ID = 'CoachContextResponse' as const

export const coachSummarySchema = Type.Object(
  {
    email: Type.String({ format: 'email' }),
    firstName: Type.String(),
    id: Type.Number(),
    lastName: Type.String()
  },
  {
    $id: COACH_SUMMARY_SCHEMA_ID,
    additionalProperties: false
  }
)

export const organizationSummarySchema = Type.Object(
  {
    id: Type.Number(),
    name: Type.String()
  },
  {
    $id: ORGANIZATION_SUMMARY_SCHEMA_ID,
    additionalProperties: false
  }
)

export const athleteSummarySchema = Type.Object(
  {
    email: Type.String({ format: 'email' }),
    firstName: Type.String(),
    id: Type.Number(),
    lastName: Type.String()
  },
  {
    $id: ATHLETE_SUMMARY_SCHEMA_ID,
    additionalProperties: false
  }
)

export const coachContextResponseSchema = Type.Object(
  {
    athletes: Type.Array(Type.Ref(athleteSummarySchema)),
    coach: Type.Ref(coachSummarySchema),
    organizations: Type.Array(Type.Ref(organizationSummarySchema))
  },
  {
    $id: COACH_CONTEXT_RESPONSE_SCHEMA_ID,
    additionalProperties: false
  }
)

export type CoachSummary = Static<typeof coachSummarySchema>
export type OrganizationSummary = Static<typeof organizationSummarySchema>
export type AthleteSummary = Static<typeof athleteSummarySchema>
export type CoachContextResponse = Static<typeof coachContextResponseSchema>
