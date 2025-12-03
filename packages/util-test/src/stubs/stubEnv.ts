export function stubEnv(env: Record<string, string>) {
  Object.entries(env).forEach(([key, value]) => {
    vi.stubEnv(key, value)
  })
}
