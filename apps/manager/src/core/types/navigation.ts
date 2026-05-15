export interface Navigation {}

export type NavigationState = {
  [Key in keyof Navigation]: string
}
