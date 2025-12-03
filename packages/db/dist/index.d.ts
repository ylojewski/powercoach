import * as drizzle_orm_node_postgres from 'drizzle-orm/node-postgres';
import { Client } from 'pg';
import * as _powercoach_util_env from '@powercoach/util-env';
import { z } from 'zod';
import * as drizzle_orm_pg_core from 'drizzle-orm/pg-core';

declare function createClient(): Promise<{
    db: drizzle_orm_node_postgres.NodePgDatabase<Record<string, never>> & {
        $client: Client;
    };
    pg: Client;
}>;

declare const envSchema: z.ZodObject<{
    NODE_ENV: z.ZodEnum<typeof _powercoach_util_env.NodeEnv>;
    DATABASE_URL: z.ZodURL;
}, z.core.$strip>;
type Env = z.infer<typeof envSchema>;

declare const loadEnv: () => Readonly<{
    NODE_ENV: _powercoach_util_env.NodeEnv;
    DATABASE_URL: string;
}>;
declare const resetCachedEnv: () => void;

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

export { type Env, createClient, envSchema, loadEnv, metadata, resetCachedEnv };
