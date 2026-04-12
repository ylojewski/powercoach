import { ZodError } from 'zod';
import process from 'process';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// src/expects/expectCollapsed.ts
function expectCollapsed(element) {
  expect(element.getAttribute("aria-expanded")).toBe("false");
}
__name(expectCollapsed, "expectCollapsed");

// src/expects/expectExpanded.ts
function expectExpanded(element) {
  expect(element.getAttribute("aria-expanded")).toBe("true");
}
__name(expectExpanded, "expectExpanded");

// src/expects/expectFunction.ts
function expectFunction(fn) {
  expect(fn).toBeInstanceOf(Function);
}
__name(expectFunction, "expectFunction");
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

// src/mocks/mockQueryResult.ts
function mockQueryResult(rows, command = "SELECT") {
  return {
    command,
    fields: [],
    oid: 0,
    rowCount: rows.length,
    rows
  };
}
__name(mockQueryResult, "mockQueryResult");

// src/spies/spyOnConsole.ts
function spyOnConsole(methods) {
  methods.forEach((method) => {
    vi.spyOn(console, method).mockImplementation(() => {
    });
  });
}
__name(spyOnConsole, "spyOnConsole");
function spyOnStdout() {
  const logs = [];
  const implementation = /* @__PURE__ */ __name((chunk) => {
    logs.push(typeof chunk === "string" ? chunk : Buffer.from(chunk).toString("utf8"));
    return true;
  }, "implementation");
  const mock = vi.spyOn(process.stdout, "write").mockImplementation(implementation);
  return {
    json: /* @__PURE__ */ __name(() => JSON.parse(`[${logs.join(",")}]`), "json"),
    mock
  };
}
__name(spyOnStdout, "spyOnStdout");

// src/stubs/stubEnv.ts
function stubEnv(env) {
  Object.entries(env).forEach(([key, value]) => {
    vi.stubEnv(key, value.toString());
  });
}
__name(stubEnv, "stubEnv");

// src/utils/appendStyle.ts
var RGB_RED = "rgb(255, 0, 0)";
var RGB_GREEN = "rgb(0, 255, 0)";
var RGB_BLUE = "rgb(0, 0, 255)";
function appendStyle(css) {
  const style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);
  return style;
}
__name(appendStyle, "appendStyle");

// src/utils/flushAsync.ts
async function flushAsync() {
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
}
__name(flushAsync, "flushAsync");

export { RGB_BLUE, RGB_GREEN, RGB_RED, appendStyle, expectCollapsed, expectExpanded, expectFunction, expectZodParseToThrow, flushAsync, mockQueryResult, spyOnConsole, spyOnStdout, stubEnv };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map