import { type Params, useLocation, useParams } from 'react-router'

import { isBackgroundState } from '../types'

export function useBackgroundParams(): Readonly<Params<string>> {
  const location = useLocation()
  const params = useParams()

  return isBackgroundState(location.state) ? location.state.params : params
}
