type ConsoleMethod =
  | 'assert'
  | 'clear'
  | 'count'
  | 'countReset'
  | 'debug'
  | 'dir'
  | 'dirxml'
  | 'error'
  | 'group'
  | 'groupCollapsed'
  | 'groupEnd'
  | 'info'
  | 'log'
  | 'profile'
  | 'profileEnd'
  | 'table'
  | 'time'
  | 'timeEnd'
  | 'timeLog'
  | 'timeStamp'
  | 'trace'
  | 'warn'

export function spyOnConsole(methods: ConsoleMethod[]) {
  methods.forEach((method) => {
    vi.spyOn(console, method).mockImplementation(() => {
      /* NOOP */
    })
  })
}
