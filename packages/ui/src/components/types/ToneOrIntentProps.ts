export type Tone = 'default' | 'primary' | 'secondary' | 'muted' | 'accent'

export type Intent = 'info' | 'success' | 'warning' | 'destructive'

export type ToneOrIntentProps =
  | {
      tone?: Tone
      intent?: never
    }
  | {
      tone?: never
      intent: Intent
    }
