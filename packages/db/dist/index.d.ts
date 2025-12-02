import * as drizzle_orm_node_postgres from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import { z, ZodError } from 'zod';
import * as drizzle_orm_pg_core from 'drizzle-orm/pg-core';

declare function createClient(): Promise<{
    db: drizzle_orm_node_postgres.NodePgDatabase<Record<string, never>> & {
        $client: Client;
    };
    pg: Client;
}>;

declare enum NodeEnv {
    development = "development",
    production = "production",
    test = "test"
}

declare const envSchema: z.ZodObject<{
    DATABASE_URL: z.ZodURL;
    NODE_ENV: z.ZodEnum<typeof NodeEnv>;
}, z.core.$strip>;
type Env = z.infer<typeof envSchema>;

declare function loadEnv(): Env;
declare function resetCachedConfig(): void;

declare function parseEnv(config: unknown, format: (error: ZodError) => string): Env;

declare const metadata: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "metadata";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "metadata";
            dataType: "number";
            columnType: "PgSerial";
            data: number;
            driverParam: number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        key: drizzle_orm_pg_core.PgColumn<{
            name: "key";
            tableName: "metadata";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        value: drizzle_orm_pg_core.PgColumn<{
            name: "value";
            tableName: "metadata";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;

export { type Env, NodeEnv, createClient, envSchema, loadEnv, metadata, parseEnv, resetCachedConfig };
