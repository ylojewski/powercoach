import { useLocation, MemoryRouter, Routes, Route } from 'react-router';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { render } from '@testing-library/react';

var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
function PathnameProbe({ testId }) {
  const location = useLocation();
  return /* @__PURE__ */ jsx("div", { "data-testid": testId, children: location.pathname });
}
__name(PathnameProbe, "PathnameProbe");
function renderWithRouter(ui, { initialEntry = "/", path = "*", pathnameProbe, ...renderOptions } = {}) {
  const resolvedPathnameProbeTestId = pathnameProbe === true ? "pathname" : pathnameProbe || void 0;
  return render(
    /* @__PURE__ */ jsx(MemoryRouter, { initialEntries: [initialEntry], children: /* @__PURE__ */ jsx(Routes, { children: /* @__PURE__ */ jsx(
      Route,
      {
        element: /* @__PURE__ */ jsxs(Fragment, { children: [
          resolvedPathnameProbeTestId ? /* @__PURE__ */ jsx(PathnameProbe, { testId: resolvedPathnameProbeTestId }) : null,
          ui
        ] }),
        path
      }
    ) }) }),
    renderOptions
  );
}
__name(renderWithRouter, "renderWithRouter");

export { PathnameProbe, renderWithRouter };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map