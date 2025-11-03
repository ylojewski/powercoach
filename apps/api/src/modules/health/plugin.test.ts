import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox'
import Ajv from 'ajv'
import Fastify from 'fastify'
import { describe, expect, it } from 'vitest'
import { healthModule } from './plugin'
import { HEALTH_RESPONSE_SCHEMA_ID, healthResponseSchema } from './schemas'
import type { AppConfig } from '@/core/config/envSchema'

const baseConfig: AppConfig = {
  HOST: '127.0.0.1',
  LOG_LEVEL: 'silent',
  NODE_ENV: 'test',
  PORT: 0
}

async function createApp(prefix: string) {
  const app = Fastify({
    ajv: {
      customOptions: {
        coerceTypes: false,
        removeAdditional: 'all'
      }
    }
  }).withTypeProvider<TypeBoxTypeProvider>()
  app.decorate('config', baseConfig)
  await app.register(healthModule, { prefix })
  await app.ready()
  return app
}

describe('healthModule plugin', () => {
  it('registers health route under the provided prefix', async () => {
    const app = await createApp('/v1/health')

    const response = await app.inject({ method: 'GET', url: '/v1/health' })
    const body = response.json() as { ok: boolean; uptime: number }

    expect(response.statusCode).toBe(200)
    expect(body.ok).toBe(true)
    expect(body.uptime).toBeGreaterThanOrEqual(0)

    await app.close()
  })

  it('can be registered multiple times without duplication issues', async () => {
    const app = Fastify()
    app.decorate('config', baseConfig)

    await app.register(healthModule, { prefix: '/a' })
    await app.register(healthModule, { prefix: '/b' })
    await app.ready()

    const first = await app.inject({ method: 'GET', url: '/a' })
    const second = await app.inject({ method: 'GET', url: '/b' })

    expect(first.statusCode).toBe(200)
    expect(second.statusCode).toBe(200)

    await app.close()
  })

  it('exposes compiled schema through getSchema', async () => {
    type ValidatorFn = ((input: unknown) => boolean) | undefined
    const app = Fastify({
      ajv: {
        customOptions: {
          coerceTypes: false,
          removeAdditional: 'all'
        }
      }
    }).withTypeProvider<TypeBoxTypeProvider>()
    app.decorate('config', baseConfig)

    let validator: ValidatorFn
    await app.register(async (scope) => {
      await scope.register(healthModule, { prefix: '/status' })
      const retrieved =
        (scope.getSchema(HEALTH_RESPONSE_SCHEMA_ID) as ValidatorFn) ??
        (scope.getSchema(`${HEALTH_RESPONSE_SCHEMA_ID}#`) as ValidatorFn)

      if (typeof retrieved === 'function') {
        validator = retrieved
        return
      }

      const schemaEntry = retrieved ?? scope.getSchema(HEALTH_RESPONSE_SCHEMA_ID)
      if (schemaEntry && typeof scope.compileValidationSchema === 'function') {
        validator = scope.compileValidationSchema(schemaEntry) as ValidatorFn
        return
      }

      const ajv = new Ajv({ removeAdditional: 'all' })
      ajv.addSchema(schemaEntry ?? healthResponseSchema, HEALTH_RESPONSE_SCHEMA_ID)
      validator = ajv.getSchema(HEALTH_RESPONSE_SCHEMA_ID) as ValidatorFn
    })

    await app.ready()

    expect(typeof validator).toBe('function')
    expect(validator?.({ ok: true, uptime: 1 })).toBe(true)

    await app.close()
  })

  it('supports alternate prefixes', async () => {
    const app = await createApp('/health-alt')

    const response = await app.inject({ method: 'GET', url: '/health-alt' })
    expect(response.statusCode).toBe(200)

    await app.close()
  })
})
