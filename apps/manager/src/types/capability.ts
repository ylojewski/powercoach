export interface Loadable {
  isLoading: boolean
  load: () => VoidFunction
}

export interface Syncable<TPayload = void, TResult = void> {
  sync: (payload: TPayload) => TResult
}
