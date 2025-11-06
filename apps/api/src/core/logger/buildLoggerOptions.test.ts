import { expect } from 'vitest'

import { NodeEnv } from '@/src/types'

import { buildLoggerOptions } from './buildLoggerOptions'

describe('buildLogger', () => {
  it('passes the LOG_LEVEL environment variable as level', async () => {
    const options = buildLoggerOptions({
      level: 'info',
      nodeEnv: NodeEnv.production
    })

    expect(options).toMatchObject({
      level: 'info'
    })
  })

  it('serializes request headers', async () => {
    const options = buildLoggerOptions({
      level: 'info',
      nodeEnv: NodeEnv.production
    })

    expect(options.serializers?.req?.({ headers: { foo: 'bar' } })).toMatchObject({
      headers: { foo: 'bar' }
    })
  })

  it('redacts critical paths', async () => {
    const options = buildLoggerOptions({
      level: 'info',
      nodeEnv: NodeEnv.production
    })

    expect(options).toMatchObject({
      redact: {
        paths: ['req.headers.authorization']
      }
    })
  })

  it('creates production logger options without transport', async () => {
    const options = buildLoggerOptions({
      level: 'info',
      nodeEnv: NodeEnv.production
    })

    expect(options).not.toMatchObject({
      transport: expect.anything()
    })
  })

  it('enables pretty transport outside production', async () => {
    const options = buildLoggerOptions({
      level: 'info',
      nodeEnv: NodeEnv.test
    })

    expect(options).toMatchObject({
      transport: expect.objectContaining({
        target: 'pino-pretty'
      })
    })
  })

  it('disables redaction in development', async () => {
    const options = buildLoggerOptions({
      level: 'info',
      nodeEnv: NodeEnv.development
    })

    expect(options).not.toMatchObject({
      redact: expect.anything()
    })
  })
})
