import { ZodError } from 'zod';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
function expectZodParseToThrow(schema, values) {
  let zodError = new ZodError([]);
  expect(() => {
    try {
      schema.parse(values);
    } catch (error) {
      zodError = error;
      throw error;
    }
  }).toThrowError(ZodError);
  return zodError;
}
__name(expectZodParseToThrow, "expectZodParseToThrow");

// src/spies/spyOnConsole.ts
function spyOnConsole(methods) {
  methods.forEach((method) => {
    vi.spyOn(console, method).mockImplementation(() => {
    });
  });
}
__name(spyOnConsole, "spyOnConsole");

// src/stubs/stubEnv.ts
function stubEnv(env) {
  Object.entries(env).forEach(([key, value]) => {
    vi.stubEnv(key, value);
  });
}
__name(stubEnv, "stubEnv");

export { expectZodParseToThrow, spyOnConsole, stubEnv };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map