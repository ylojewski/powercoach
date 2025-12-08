import { ZodObject, ZodError } from 'zod';
import { QueryResultRow, QueryResult } from 'pg';
import process from 'node:process';
import { Mock } from 'vitest';

declare function expectFunction(fn: unknown): asserts fn is (...args: unknown[]) => unknown;

declare function expectZodParseToThrow(schema: ZodObject, values: unknown): ZodError;

declare function mockQueryResult<T extends QueryResultRow>(rows: T[], command?: string): QueryResult<T>;

type ConsoleMethod = 'assert' | 'clear' | 'count' | 'countReset' | 'debug' | 'dir' | 'dirxml' | 'error' | 'group' | 'groupCollapsed' | 'groupEnd' | 'info' | 'log' | 'profile' | 'profileEnd' | 'table' | 'time' | 'timeEnd' | 'timeLog' | 'timeStamp' | 'trace' | 'warn';
declare function spyOnConsole(methods: ConsoleMethod[]): void;

type ProcessSTDOutWrite = typeof process.stdout.write;
declare function spyOnStdout(): {
    json<T>(): T;
    mock: Mock<ProcessSTDOutWrite>;
};

declare function stubEnv(env: Record<string, string | number>): void;

declare function flushAsync(): Promise<void>;

export { expectFunction, expectZodParseToThrow, flushAsync, mockQueryResult, spyOnConsole, spyOnStdout, stubEnv };
