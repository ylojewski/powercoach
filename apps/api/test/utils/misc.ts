export function expectFunction(fn: unknown): asserts fn is (...args: unknown[]) => unknown {
  expect(fn).toBeInstanceOf(Function)
}
