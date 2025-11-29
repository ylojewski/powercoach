import { fetchFirstUser, fallbackUser } from '@powercoach/db'

export function getUserProfile() {
  return fetchFirstUser().catch(() => fallbackUser)
}
