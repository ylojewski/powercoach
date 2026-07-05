import { useDispatch } from 'react-redux'

import { type Dispatch } from '../store'

export const useAppDispatch = useDispatch.withTypes<Dispatch>()
