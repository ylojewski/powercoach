import { useDispatch } from 'react-redux'

import { type Dispatch } from '@/src/store'

export const useAppDispatch = useDispatch.withTypes<Dispatch>()
