import { ApplicationError } from './ApplicationError'

export class InvalidCoachSettingsError extends ApplicationError {
  constructor(coachEmail: string) {
    super(`Coach settings for "${coachEmail}" are invalid`, 500)
  }
}
