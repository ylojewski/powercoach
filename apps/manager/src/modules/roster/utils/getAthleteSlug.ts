import { type Athlete } from '@/src/api'

export function getAthleteSlug({ firstName, lastName }: Athlete): string {
  return `${firstName} ${lastName}`
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
