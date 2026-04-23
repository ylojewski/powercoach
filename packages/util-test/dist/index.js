import { ZodError } from 'zod';
import { vi as vi$1 } from 'vitest';
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
function mockDb() {
  const children = /* @__PURE__ */ new Map();
  const target = vi$1.fn();
  let proxy;
  const wrapRootMethod = /* @__PURE__ */ __name((value) => {
    if (typeof value !== "function") {
      return value;
    }
    return (...args) => {
      const result = Reflect.apply(value, target, args);
      return result === target ? proxy : result;
    };
  }, "wrapRootMethod");
  const resolveTerminalValue = /* @__PURE__ */ __name(() => {
    const result = Reflect.apply(target, target, []);
    return Promise.resolve(result === proxy ? void 0 : result);
  }, "resolveTerminalValue");
  proxy = new Proxy(target, {
    get(_target, prop, receiver) {
      if (prop === "then") {
        return (onfulfilled, onrejected) => resolveTerminalValue().then(onfulfilled, onrejected);
      }
      if (prop === "catch") {
        return (onrejected) => resolveTerminalValue().catch(onrejected);
      }
      if (prop === "finally") {
        return (onfinally) => resolveTerminalValue().finally(onfinally);
      }
      if (typeof prop === "symbol") {
        return Reflect.get(target, prop, receiver);
      }
      if (prop in target) {
        const value = Reflect.get(target, prop, target);
        return wrapRootMethod(value);
      }
      if (!children.has(prop)) {
        const child2 = vi$1.fn(() => proxy);
        child2.mockName(String(prop));
        children.set(prop, child2);
      }
      const child = children.get(prop);
      if (!child) {
        throw new Error(`Missing mockDb child for property "${String(prop)}"`);
      }
      return child;
    },
    apply(_target, thisArg, argArray) {
      return Reflect.apply(target, thisArg, argArray);
    }
  });
  target.mockImplementation(() => proxy);
  return proxy;
}
__name(mockDb, "mockDb");

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

// src/utils/createQueryResultRows.ts
function createQueryResultRows(rows, command = "SELECT") {
  return {
    command,
    fields: [],
    oid: 0,
    rowCount: rows.length,
    rows
  };
}
__name(createQueryResultRows, "createQueryResultRows");

// src/utils/flushAsync.ts
async function flushAsync() {
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
}
__name(flushAsync, "flushAsync");

export { RGB_BLUE, RGB_GREEN, RGB_RED, appendStyle, createQueryResultRows, expectCollapsed, expectExpanded, expectFunction, expectZodParseToThrow, flushAsync, mockDb, spyOnConsole, spyOnStdout, stubEnv };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map