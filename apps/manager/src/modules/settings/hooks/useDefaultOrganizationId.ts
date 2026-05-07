import { useSettingsFeature } from './useSettingsFeature'

export function useDefaultOrganizationId(): number | null {
  return useSettingsFeature().defaultOrganizationId
}
