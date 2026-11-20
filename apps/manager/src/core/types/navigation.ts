/** Shared contract augmented by the app shell and every mounted module. */
export interface Navigation {}

export type NavigationState = {
  [Key in keyof Navigation]: string
}
