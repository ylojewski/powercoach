import { z, ZodError } from 'zod';

declare enum NodeEnv {
    development = "development",
    production = "production",
    test = "test"
}

declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodEnum<typeof NodeEnv>;
}, z.core.$strip>;
type Env = z.infer<typeof envSchema>;

interface CreateEnvLoaderOptions<TEnv extends z.ZodType<Env>> {
    format: (error: ZodError) => string;
    schema: TEnv;
}
declare function createEnvLoader<TEnv extends z.ZodType<Env>>({ format, schema }: CreateEnvLoaderOptions<TEnv>): {
    loadEnv: () => Readonly<z.infer<TEnv>>;
    resetCachedEnv: () => void;
};

declare function parseEnv<TEnv extends z.ZodType<Env>>(schema: TEnv, env: unknown, format: (error: ZodError) => string): z.infer<TEnv>;

export { type CreateEnvLoaderOptions, type Env, NodeEnv, createEnvLoader, envSchema, parseEnv };
