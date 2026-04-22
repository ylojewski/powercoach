import { type NodePgDatabase } from 'drizzle-orm/node-postgres'

import { athletes, coachOrganizations, coachSettings, coaches, organizations } from '@/src/schema'

const DEMO_PASSWORD = 'powercoach-demo' as const

export async function execute(db: NodePgDatabase) {
  const [coach] = await db
    .insert(coaches)
    .values({
      email: 'astra.quill@example.test',
      firstName: 'Astra',
      lastName: 'Quill',
      password: DEMO_PASSWORD
    })
    .returning({ id: coaches.id })

  const [defaultOrganization, secondaryOrganization] = await db
    .insert(organizations)
    .values([{ name: 'Orbit Foundry' }, { name: 'Nova Athletics' }])
    .returning({ id: organizations.id })

  if (!coach || !defaultOrganization || !secondaryOrganization) {
    throw new Error('Failed to seed roster data')
  }

  await db.insert(coachOrganizations).values([
    {
      coachId: coach.id,
      organizationId: defaultOrganization.id
    },
    {
      coachId: coach.id,
      organizationId: secondaryOrganization.id
    }
  ])

  await db.insert(coachSettings).values({
    coachId: coach.id,
    defaultOrganizationId: defaultOrganization.id
  })

  await db.insert(athletes).values([
    {
      coachId: coach.id,
      email: 'kiro.flux@example.test',
      firstName: 'Kiro',
      lastName: 'Flux',
      organizationId: defaultOrganization.id,
      password: DEMO_PASSWORD
    },
    {
      coachId: coach.id,
      email: 'nexa.vale@example.test',
      firstName: 'Nexa',
      lastName: 'Vale',
      organizationId: defaultOrganization.id,
      password: DEMO_PASSWORD
    },
    {
      coachId: coach.id,
      email: 'tomo.pixel@example.test',
      firstName: 'Tomo',
      lastName: 'Pixel',
      organizationId: secondaryOrganization.id,
      password: DEMO_PASSWORD
    }
  ])
}
