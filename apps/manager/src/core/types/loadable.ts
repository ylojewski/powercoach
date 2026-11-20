export type LoadableStatus = 'idle' | 'loading' | 'ready' | 'error'

export interface Loadable {
  status: LoadableStatus
  load: () => VoidFunction
}
