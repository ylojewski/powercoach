import { useSelector } from 'react-redux'

import { type State } from '../store'

export const useAppSelector = useSelector.withTypes<State>()
