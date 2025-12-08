export function stubEnv(env: Record<string, string | number>) {
  Object.entries(env).forEach(([key, value]) => {
    vi.stubEnv(key, value.toString())
  })
}
