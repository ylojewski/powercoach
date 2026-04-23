import { vi } from 'vitest'

export type MockedDb = ReturnType<typeof vi.fn> & {
  [key: string]: MockedDb
}

export function mockDb(): MockedDb {
  const children = new Map<PropertyKey, MockedDb>()
  const target = vi.fn()
  let proxy!: MockedDb

  const wrapRootMethod = (value: unknown) => {
    if (typeof value !== 'function') {
      return value
    }

    return (...args: unknown[]) => {
      const result = Reflect.apply(value, target, args)
      return result === target ? proxy : result
    }
  }

  const resolveTerminalValue = () => {
    const result = Reflect.apply(target, target, [])
    return Promise.resolve(result === proxy ? undefined : result)
  }

  proxy = new Proxy(target as MockedDb, {
    get(_target, prop, receiver) {
      if (prop === 'then') {
        return <TResult1 = unknown, TResult2 = never>(
          onfulfilled?: ((value: unknown) => TResult1 | PromiseLike<TResult1>) | null,
          onrejected?: ((reason: unknown) => TResult2 | PromiseLike<TResult2>) | null
        ) => resolveTerminalValue().then(onfulfilled, onrejected)
      }

      if (prop === 'catch') {
        return <TResult = never>(
          onrejected?: ((reason: unknown) => TResult | PromiseLike<TResult>) | null
        ) => resolveTerminalValue().catch(onrejected)
      }

      if (prop === 'finally') {
        return (onfinally?: (() => void) | null) => resolveTerminalValue().finally(onfinally)
      }

      if (typeof prop === 'symbol') {
        return Reflect.get(target, prop, receiver)
      }

      if (prop in target) {
        const value = Reflect.get(target, prop, target)
        return wrapRootMethod(value)
      }

      if (!children.has(prop)) {
        const child = vi.fn(() => proxy) as MockedDb
        child.mockName(String(prop))
        children.set(prop, child)
      }

      const child = children.get(prop)

      if (!child) {
        throw new Error(`Missing mockDb child for property "${String(prop)}"`)
      }

      return child
    },

    apply(_target, thisArg, argArray) {
      return Reflect.apply(target, thisArg, argArray)
    }
  })

  target.mockImplementation(() => proxy)

  return proxy
}
