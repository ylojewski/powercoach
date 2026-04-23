export const DEMO_PASSWORD = 'powercoach-demo' as const

export const COACH_EMAIL = 'astra.quill@example.test' as const
export const COACH = {
  email: COACH_EMAIL,
  firstName: 'Astra',
  lastName: 'Quill'
} as const
export const COACH_ROW = {
  ...COACH,
  password: DEMO_PASSWORD
} as const

export const DEFAULT_ORGANIZATION = {
  name: 'Orbit Foundry'
} as const
export const SECONDARY_ORGANIZATION = {
  name: 'Nova Athletics'
} as const
export const ORGANIZATIONS = [DEFAULT_ORGANIZATION, SECONDARY_ORGANIZATION] as const

export const PRIMARY_ATHLETE = {
  email: 'kiro.flux@example.test',
  firstName: 'Kiro',
  lastName: 'Flux'
} as const
export const PRIMARY_ATHLETE_ROW = {
  ...PRIMARY_ATHLETE,
  password: DEMO_PASSWORD
} as const

export const SECONDARY_ATHLETE = {
  email: 'nexa.vale@example.test',
  firstName: 'Nexa',
  lastName: 'Vale'
} as const
export const SECONDARY_ATHLETE_ROW = {
  ...SECONDARY_ATHLETE,
  password: DEMO_PASSWORD
} as const

export const TERTIARY_ATHLETE = {
  email: 'tomo.pixel@example.test',
  firstName: 'Tomo',
  lastName: 'Pixel'
} as const
export const TERTIARY_ATHLETE_ROW = {
  ...TERTIARY_ATHLETE,
  password: DEMO_PASSWORD
} as const

export const DEFAULT_ORGANIZATION_ATHLETES = [PRIMARY_ATHLETE, SECONDARY_ATHLETE] as const
export const ATHLETES = [...DEFAULT_ORGANIZATION_ATHLETES, TERTIARY_ATHLETE] as const
export const ATHLETE_ROWS = [
  PRIMARY_ATHLETE_ROW,
  SECONDARY_ATHLETE_ROW,
  TERTIARY_ATHLETE_ROW
] as const

export const DEFAULT_ORGANIZATION_ID = 1 as const
export const SECONDARY_ORGANIZATION_ID = 2 as const
export const COACH_ID = 10 as const
export const PRIMARY_ATHLETE_ID = 11 as const
export const SECONDARY_ATHLETE_ID = 12 as const
export const TERTIARY_ATHLETE_ID = 13 as const

export const COACH_RESPONSE = {
  ...COACH,
  id: COACH_ID
} as const
export const DEFAULT_ORGANIZATION_RESPONSE = {
  ...DEFAULT_ORGANIZATION,
  id: DEFAULT_ORGANIZATION_ID
} as const
export const SECONDARY_ORGANIZATION_RESPONSE = {
  ...SECONDARY_ORGANIZATION,
  id: SECONDARY_ORGANIZATION_ID
} as const
export const PRIMARY_ATHLETE_RESPONSE = {
  ...PRIMARY_ATHLETE,
  id: PRIMARY_ATHLETE_ID,
  organizationId: DEFAULT_ORGANIZATION_ID
} as const
export const SECONDARY_ATHLETE_RESPONSE = {
  ...SECONDARY_ATHLETE,
  id: SECONDARY_ATHLETE_ID,
  organizationId: DEFAULT_ORGANIZATION_ID
} as const
export const TERTIARY_ATHLETE_RESPONSE = {
  ...TERTIARY_ATHLETE,
  id: TERTIARY_ATHLETE_ID,
  organizationId: SECONDARY_ORGANIZATION_ID
} as const

export const SETTINGS_RESPONSE = {
  defaultOrganizationId: DEFAULT_ORGANIZATION_ID
} as const
export const ROSTER_RESPONSE = {
  athletes: [PRIMARY_ATHLETE_RESPONSE, SECONDARY_ATHLETE_RESPONSE],
  coach: COACH_RESPONSE,
  organizations: [DEFAULT_ORGANIZATION_RESPONSE, SECONDARY_ORGANIZATION_RESPONSE]
} as const
export const SECONDARY_ORGANIZATION_ROSTER_RESPONSE = {
  athletes: [TERTIARY_ATHLETE_RESPONSE],
  coach: COACH_RESPONSE,
  organizations: [DEFAULT_ORGANIZATION_RESPONSE, SECONDARY_ORGANIZATION_RESPONSE]
} as const

export const GHOST_COACH_EMAIL = 'ghost.coach@example.test' as const
export const MISSING_SETTINGS_COACH = {
  email: 'missing.settings@example.test',
  firstName: 'Missing',
  lastName: 'Settings',
  password: DEMO_PASSWORD
} as const
export const NO_ORGANIZATIONS_COACH = {
  email: 'no.organizations@example.test',
  firstName: 'No',
  lastName: 'Organizations',
  password: DEMO_PASSWORD
} as const
export const EMPTY_ORGANIZATION = {
  name: 'Empty Athletics'
} as const
