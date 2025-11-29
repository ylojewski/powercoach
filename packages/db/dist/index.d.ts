import { drizzle } from 'drizzle-orm/neon-http';
import { z, ZodError } from 'zod';
import * as drizzle_orm_pg_core from 'drizzle-orm/pg-core';

declare const dbEnvSchema: z.ZodObject<{
    DATABASE_URL: z.ZodString;
}, z.core.$strip>;
type DbConfig = z.infer<typeof dbEnvSchema>;

declare function loadDbConfig(): DbConfig;
declare function resetCachedDbConfig(): void;

declare function parseDbConfig(config: unknown, format: (error: ZodError) => string): DbConfig;

declare const users: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "users";
    schema: undefined;
    columns: {
        email: drizzle_orm_pg_core.PgColumn<{
            name: "email";
            tableName: "users";
            dataType: "string";
            columnType: "PgVarchar";
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
        }, {}, {
            length: 255;
        }>;
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "users";
            dataType: "string";
            columnType: "PgUUID";
            data: string;
            driverParam: string;
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
    };
    dialect: "pg";
}>;
type User = typeof users.$inferSelect;

type DbClient = ReturnType<typeof drizzle>;
declare const fallbackUser: User;
declare function createDb(config?: DbConfig): DbClient;
declare function fetchFirstUser(db?: DbClient): Promise<User>;

export { type DbClient, type DbConfig, type User, createDb, dbEnvSchema, fallbackUser, fetchFirstUser, loadDbConfig, parseDbConfig, resetCachedDbConfig, users };
