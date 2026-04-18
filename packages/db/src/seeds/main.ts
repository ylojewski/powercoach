import { type NodePgDatabase } from 'drizzle-orm/node-postgres'

import { athletes, coachOrganizations, coaches, organizations } from '@/src/schema'

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

  const [organization] = await db
    .insert(organizations)
    .values({ name: 'Orbit Foundry' })
    .returning({ id: organizations.id })

  if (!coach || !organization) {
    throw new Error('Failed to seed roster data')
  }

  await db.insert(coachOrganizations).values({
    coachId: coach.id,
    organizationId: organization.id
  })

  await db.insert(athletes).values([
    {
      coachId: coach.id,
      email: 'kiro.flux@example.test',
      firstName: 'Kiro',
      lastName: 'Flux',
      password: DEMO_PASSWORD
    },
    {
      coachId: coach.id,
      email: 'nexa.vale@example.test',
      firstName: 'Nexa',
      lastName: 'Vale',
      password: DEMO_PASSWORD
    },
    {
      coachId: coach.id,
      email: 'tomo.pixel@example.test',
      firstName: 'Tomo',
      lastName: 'Pixel',
      password: DEMO_PASSWORD
    }
  ])
}
