import { useSelector } from 'react-redux'

import { type State } from '@/src/store'

export const useAppSelector = useSelector.withTypes<State>()
