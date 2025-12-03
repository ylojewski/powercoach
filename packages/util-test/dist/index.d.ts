import { ZodObject, ZodError } from 'zod';

declare function expectZodParseToThrow(schema: ZodObject, values: unknown): ZodError;

type ConsoleMethod = 'assert' | 'clear' | 'count' | 'countReset' | 'debug' | 'dir' | 'dirxml' | 'error' | 'group' | 'groupCollapsed' | 'groupEnd' | 'info' | 'log' | 'profile' | 'profileEnd' | 'table' | 'time' | 'timeEnd' | 'timeLog' | 'timeStamp' | 'trace' | 'warn';
declare function spyOnConsole(methods: ConsoleMethod[]): void;

declare function stubEnv(env: Record<string, string>): void;

export { expectZodParseToThrow, spyOnConsole, stubEnv };
