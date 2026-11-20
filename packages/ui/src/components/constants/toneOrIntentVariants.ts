import { type Intent, type Tone } from '../types/ToneOrIntentProps'

export const TONE_OR_INTENT_VARIANTS = {
  intent: {
    destructive: 'text-destructive-foreground',
    info: 'text-info-foreground',
    success: 'text-success-foreground',
    warning: 'text-warning-foreground'
  } satisfies Record<Intent, string>,
  tone: {
    accent: 'text-accent-foreground',
    default: 'text-foreground',
    muted: 'text-muted-foreground',
    primary: 'text-primary',
    secondary: 'text-secondary-foreground'
  } satisfies Record<Tone, string>
} as const
