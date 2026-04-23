import { ZodObject, ZodError } from 'zod';
import { vi, Mock } from 'vitest';
import process from 'node:process';
import { QueryResultRow, QueryResult } from 'pg';

declare function expectCollapsed(element: HTMLElement): void;

declare function expectExpanded(element: HTMLElement): void;

declare function expectFunction(fn: unknown): asserts fn is (...args: unknown[]) => unknown;

declare function expectZodParseToThrow(schema: ZodObject, values: unknown): ZodError;

type MockedDb = ReturnType<typeof vi.fn> & {
    [key: string]: MockedDb;
};
declare function mockDb(): MockedDb;

type ConsoleMethod = 'assert' | 'clear' | 'count' | 'countReset' | 'debug' | 'dir' | 'dirxml' | 'error' | 'group' | 'groupCollapsed' | 'groupEnd' | 'info' | 'log' | 'profile' | 'profileEnd' | 'table' | 'time' | 'timeEnd' | 'timeLog' | 'timeStamp' | 'trace' | 'warn';
declare function spyOnConsole(methods: ConsoleMethod[]): void;

type ProcessSTDOutWrite = typeof process.stdout.write;
declare function spyOnStdout(): {
    json<T>(): T;
    mock: Mock<ProcessSTDOutWrite>;
};

declare function stubEnv(env: Record<string, string | number>): void;

declare const RGB_RED: "rgb(255, 0, 0)";
declare const RGB_GREEN: "rgb(0, 255, 0)";
declare const RGB_BLUE: "rgb(0, 0, 255)";
declare function appendStyle(css: string): HTMLStyleElement;

declare function createQueryResultRows<T extends QueryResultRow>(rows: T[], command?: string): QueryResult<T>;

declare function flushAsync(): Promise<void>;

export { type MockedDb, RGB_BLUE, RGB_GREEN, RGB_RED, appendStyle, createQueryResultRows, expectCollapsed, expectExpanded, expectFunction, expectZodParseToThrow, flushAsync, mockDb, spyOnConsole, spyOnStdout, stubEnv };
