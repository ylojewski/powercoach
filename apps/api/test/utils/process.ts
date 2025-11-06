import process from 'node:process'

import { Mock } from 'vitest'

export type ProcessSTDOutWrite = typeof process.stdout.write

export function spyOnStdout(): { json<T>(): T; mock: Mock<ProcessSTDOutWrite> } {
  const logs: string[] = []
  const implementation: ProcessSTDOutWrite = (chunk) => {
    logs.push(typeof chunk === 'string' ? chunk : Buffer.from(chunk).toString('utf8'))
    return true
  }
  const mock = vi.spyOn(process.stdout, 'write').mockImplementation(implementation)

  return {
    json: <T>(): T => JSON.parse(`[${logs.join(',')}]`) as T,
    mock
  }
}

export async function flushAsync() {
  await new Promise((resolve) => setImmediate(resolve))
  await new Promise((resolve) => setImmediate(resolve))
}
