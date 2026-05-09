import { selectRouterConfig, type RouterConfig } from '../store'
import { useAppSelector } from './useAppSelector'

export function useRouterConfig(): RouterConfig {
  return useAppSelector(selectRouterConfig)
}
