import * as S from "react";
import Ue from "react";
var le = { exports: {} }, te = {};
var ye;
function Be() {
  if (ye) return te;
  ye = 1;
  var e = Symbol.for("react.transitional.element"), o = Symbol.for("react.fragment");
  function r(t, s, a) {
    var i = null;
    if (a !== void 0 && (i = "" + a), s.key !== void 0 && (i = "" + s.key), "key" in s) {
      a = {};
      for (var u in s)
        u !== "key" && (a[u] = s[u]);
    } else a = s;
    return s = a.ref, {
      $$typeof: e,
      type: t,
      key: i,
      ref: s !== void 0 ? s : null,
      props: a
    };
  }
  return te.Fragment = o, te.jsx = r, te.jsxs = r, te;
}
var oe = {};
var ke;
function qe() {
  return ke || (ke = 1, process.env.NODE_ENV !== "production" && (function() {
    function e(n) {
      if (n == null) return null;
      if (typeof n == "function")
        return n.$$typeof === ae ? null : n.displayName || n.name || null;
      if (typeof n == "string") return n;
      switch (n) {
        case w:
          return "Fragment";
        case B:
          return "Profiler";
        case j:
          return "StrictMode";
        case N:
          return "Suspense";
        case D:
          return "SuspenseList";
        case se:
          return "Activity";
      }
      if (typeof n == "object")
        switch (typeof n.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), n.$$typeof) {
          case _:
            return "Portal";
          case L:
            return n.displayName || "Context";
          case Y:
            return (n._context.displayName || "Context") + ".Consumer";
          case G:
            var b = n.render;
            return n = n.displayName, n || (n = b.displayName || b.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
          case p:
            return b = n.displayName || null, b !== null ? b : e(n.type) || "Memo";
          case A:
            b = n._payload, n = n._init;
            try {
              return e(n(b));
            } catch {
            }
        }
      return null;
    }
    function o(n) {
      return "" + n;
    }
    function r(n) {
      try {
        o(n);
        var b = !1;
      } catch {
        b = !0;
      }
      if (b) {
        b = console;
        var h = b.error, y = typeof Symbol == "function" && Symbol.toStringTag && n[Symbol.toStringTag] || n.constructor.name || "Object";
        return h.call(
          b,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          y
        ), o(n);
      }
    }
    function t(n) {
      if (n === w) return "<>";
      if (typeof n == "object" && n !== null && n.$$typeof === A)
        return "<...>";
      try {
        var b = e(n);
        return b ? "<" + b + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function s() {
      var n = F.A;
      return n === null ? null : n.getOwner();
    }
    function a() {
      return Error("react-stack-top-frame");
    }
    function i(n) {
      if (Q.call(n, "key")) {
        var b = Object.getOwnPropertyDescriptor(n, "key").get;
        if (b && b.isReactWarning) return !1;
      }
      return n.key !== void 0;
    }
    function u(n, b) {
      function h() {
        P || (P = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          b
        ));
      }
      h.isReactWarning = !0, Object.defineProperty(n, "key", {
        get: h,
        configurable: !0
      });
    }
    function d() {
      var n = e(this.type);
      return O[n] || (O[n] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), n = this.props.ref, n !== void 0 ? n : null;
    }
    function f(n, b, h, y, I, q) {
      var v = h.ref;
      return n = {
        $$typeof: T,
        type: n,
        key: b,
        props: h,
        _owner: y
      }, (v !== void 0 ? v : null) !== null ? Object.defineProperty(n, "ref", {
        enumerable: !1,
        get: d
      }) : Object.defineProperty(n, "ref", { enumerable: !1, value: null }), n._store = {}, Object.defineProperty(n._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(n, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(n, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: I
      }), Object.defineProperty(n, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: q
      }), Object.freeze && (Object.freeze(n.props), Object.freeze(n)), n;
    }
    function k(n, b, h, y, I, q) {
      var v = b.children;
      if (v !== void 0)
        if (y)
          if (K(v)) {
            for (y = 0; y < v.length; y++)
              x(v[y]);
            Object.freeze && Object.freeze(v);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else x(v);
      if (Q.call(b, "key")) {
        v = e(n);
        var M = Object.keys(b).filter(function(J) {
          return J !== "key";
        });
        y = 0 < M.length ? "{key: someKey, " + M.join(": ..., ") + ": ...}" : "{key: someKey}", re[v + y] || (M = 0 < M.length ? "{" + M.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          y,
          v,
          M,
          v
        ), re[v + y] = !0);
      }
      if (v = null, h !== void 0 && (r(h), v = "" + h), i(b) && (r(b.key), v = "" + b.key), "key" in b) {
        h = {};
        for (var $ in b)
          $ !== "key" && (h[$] = b[$]);
      } else h = b;
      return v && u(
        h,
        typeof n == "function" ? n.displayName || n.name || "Unknown" : n
      ), f(
        n,
        v,
        h,
        s(),
        I,
        q
      );
    }
    function x(n) {
      R(n) ? n._store && (n._store.validated = 1) : typeof n == "object" && n !== null && n.$$typeof === A && (n._payload.status === "fulfilled" ? R(n._payload.value) && n._payload.value._store && (n._payload.value._store.validated = 1) : n._store && (n._store.validated = 1));
    }
    function R(n) {
      return typeof n == "object" && n !== null && n.$$typeof === T;
    }
    var C = Ue, T = Symbol.for("react.transitional.element"), _ = Symbol.for("react.portal"), w = Symbol.for("react.fragment"), j = Symbol.for("react.strict_mode"), B = Symbol.for("react.profiler"), Y = Symbol.for("react.consumer"), L = Symbol.for("react.context"), G = Symbol.for("react.forward_ref"), N = Symbol.for("react.suspense"), D = Symbol.for("react.suspense_list"), p = Symbol.for("react.memo"), A = Symbol.for("react.lazy"), se = Symbol.for("react.activity"), ae = Symbol.for("react.client.reference"), F = C.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, Q = Object.prototype.hasOwnProperty, K = Array.isArray, z = console.createTask ? console.createTask : function() {
      return null;
    };
    C = {
      react_stack_bottom_frame: function(n) {
        return n();
      }
    };
    var P, O = {}, m = C.react_stack_bottom_frame.bind(
      C,
      a
    )(), ee = z(t(a)), re = {};
    oe.Fragment = w, oe.jsx = function(n, b, h) {
      var y = 1e4 > F.recentlyCreatedOwnerStacks++;
      return k(
        n,
        b,
        h,
        !1,
        y ? Error("react-stack-top-frame") : m,
        y ? z(t(n)) : ee
      );
    }, oe.jsxs = function(n, b, h) {
      var y = 1e4 > F.recentlyCreatedOwnerStacks++;
      return k(
        n,
        b,
        h,
        !0,
        y ? Error("react-stack-top-frame") : m,
        y ? z(t(n)) : ee
      );
    };
  })()), oe;
}
var xe;
function Je() {
  return xe || (xe = 1, process.env.NODE_ENV === "production" ? le.exports = Be() : le.exports = qe()), le.exports;
}
var ge = Je();
function we(e, o) {
  if (typeof e == "function")
    return e(o);
  e != null && (e.current = o);
}
function Xe(...e) {
  return (o) => {
    let r = !1;
    const t = e.map((s) => {
      const a = we(s, o);
      return !r && typeof a == "function" && (r = !0), a;
    });
    if (r)
      return () => {
        for (let s = 0; s < t.length; s++) {
          const a = t[s];
          typeof a == "function" ? a() : we(e[s], null);
        }
      };
  };
}
var He = Symbol.for("react.lazy"), ue = S[" use ".trim().toString()];
function Ze(e) {
  return typeof e == "object" && e !== null && "then" in e;
}
function Pe(e) {
  return e != null && typeof e == "object" && "$$typeof" in e && e.$$typeof === He && "_payload" in e && Ze(e._payload);
}
// @__NO_SIDE_EFFECTS__
function Qe(e) {
  const o = /* @__PURE__ */ er(e), r = S.forwardRef((t, s) => {
    let { children: a, ...i } = t;
    Pe(a) && typeof ue == "function" && (a = ue(a._payload));
    const u = S.Children.toArray(a), d = u.find(tr);
    if (d) {
      const f = d.props.children, k = u.map((x) => x === d ? S.Children.count(f) > 1 ? S.Children.only(null) : S.isValidElement(f) ? f.props.children : null : x);
      return /* @__PURE__ */ ge.jsx(o, { ...i, ref: s, children: S.isValidElement(f) ? S.cloneElement(f, void 0, k) : null });
    }
    return /* @__PURE__ */ ge.jsx(o, { ...i, ref: s, children: a });
  });
  return r.displayName = `${e}.Slot`, r;
}
var Ke = /* @__PURE__ */ Qe("Slot");
// @__NO_SIDE_EFFECTS__
function er(e) {
  const o = S.forwardRef((r, t) => {
    let { children: s, ...a } = r;
    if (Pe(s) && typeof ue == "function" && (s = ue(s._payload)), S.isValidElement(s)) {
      const i = nr(s), u = or(a, s.props);
      return s.type !== S.Fragment && (u.ref = t ? Xe(t, i) : i), S.cloneElement(s, u);
    }
    return S.Children.count(s) > 1 ? S.Children.only(null) : null;
  });
  return o.displayName = `${e}.SlotClone`, o;
}
var rr = Symbol("radix.slottable");
function tr(e) {
  return S.isValidElement(e) && typeof e.type == "function" && "__radixId" in e.type && e.type.__radixId === rr;
}
function or(e, o) {
  const r = { ...o };
  for (const t in o) {
    const s = e[t], a = o[t];
    /^on[A-Z]/.test(t) ? s && a ? r[t] = (...u) => {
      const d = a(...u);
      return s(...u), d;
    } : s && (r[t] = s) : t === "style" ? r[t] = { ...s, ...a } : t === "className" && (r[t] = [s, a].filter(Boolean).join(" "));
  }
  return { ...e, ...r };
}
function nr(e) {
  let o = Object.getOwnPropertyDescriptor(e.props, "ref")?.get, r = o && "isReactWarning" in o && o.isReactWarning;
  return r ? e.ref : (o = Object.getOwnPropertyDescriptor(e, "ref")?.get, r = o && "isReactWarning" in o && o.isReactWarning, r ? e.props.ref : e.props.ref || e.ref);
}
function ze(e) {
  var o, r, t = "";
  if (typeof e == "string" || typeof e == "number") t += e;
  else if (typeof e == "object") if (Array.isArray(e)) {
    var s = e.length;
    for (o = 0; o < s; o++) e[o] && (r = ze(e[o])) && (t && (t += " "), t += r);
  } else for (r in e) e[r] && (t && (t += " "), t += r);
  return t;
}
function Oe() {
  for (var e, o, r = 0, t = "", s = arguments.length; r < s; r++) (e = arguments[r]) && (o = ze(e)) && (t && (t += " "), t += o);
  return t;
}
const Re = (e) => typeof e == "boolean" ? `${e}` : e === 0 ? "0" : e, Ee = Oe, sr = (e, o) => (r) => {
  var t;
  if (o?.variants == null) return Ee(e, r?.class, r?.className);
  const { variants: s, defaultVariants: a } = o, i = Object.keys(s).map((f) => {
    const k = r?.[f], x = a?.[f];
    if (k === null) return null;
    const R = Re(k) || Re(x);
    return s[f][R];
  }), u = r && Object.entries(r).reduce((f, k) => {
    let [x, R] = k;
    return R === void 0 || (f[x] = R), f;
  }, {}), d = o == null || (t = o.compoundVariants) === null || t === void 0 ? void 0 : t.reduce((f, k) => {
    let { class: x, className: R, ...C } = k;
    return Object.entries(C).every((T) => {
      let [_, w] = T;
      return Array.isArray(w) ? w.includes({
        ...a,
        ...u
      }[_]) : {
        ...a,
        ...u
      }[_] === w;
    }) ? [
      ...f,
      x,
      R
    ] : f;
  }, []);
  return Ee(e, i, d, r?.class, r?.className);
}, ar = (e, o) => {
  const r = new Array(e.length + o.length);
  for (let t = 0; t < e.length; t++)
    r[t] = e[t];
  for (let t = 0; t < o.length; t++)
    r[e.length + t] = o[t];
  return r;
}, ir = (e, o) => ({
  classGroupId: e,
  validator: o
}), je = (e = /* @__PURE__ */ new Map(), o = null, r) => ({
  nextPart: e,
  validators: o,
  classGroupId: r
}), me = "-", _e = [], lr = "arbitrary..", cr = (e) => {
  const o = ur(e), {
    conflictingClassGroups: r,
    conflictingClassGroupModifiers: t
  } = e;
  return {
    getClassGroupId: (i) => {
      if (i.startsWith("[") && i.endsWith("]"))
        return dr(i);
      const u = i.split(me), d = u[0] === "" && u.length > 1 ? 1 : 0;
      return Ne(u, d, o);
    },
    getConflictingClassGroupIds: (i, u) => {
      if (u) {
        const d = t[i], f = r[i];
        return d ? f ? ar(f, d) : d : f || _e;
      }
      return r[i] || _e;
    }
  };
}, Ne = (e, o, r) => {
  if (e.length - o === 0)
    return r.classGroupId;
  const s = e[o], a = r.nextPart.get(s);
  if (a) {
    const f = Ne(e, o + 1, a);
    if (f) return f;
  }
  const i = r.validators;
  if (i === null)
    return;
  const u = o === 0 ? e.join(me) : e.slice(o).join(me), d = i.length;
  for (let f = 0; f < d; f++) {
    const k = i[f];
    if (k.validator(u))
      return k.classGroupId;
  }
}, dr = (e) => e.slice(1, -1).indexOf(":") === -1 ? void 0 : (() => {
  const o = e.slice(1, -1), r = o.indexOf(":"), t = o.slice(0, r);
  return t ? lr + t : void 0;
})(), ur = (e) => {
  const {
    theme: o,
    classGroups: r
  } = e;
  return mr(r, o);
}, mr = (e, o) => {
  const r = je();
  for (const t in e) {
    const s = e[t];
    ve(s, r, t, o);
  }
  return r;
}, ve = (e, o, r, t) => {
  const s = e.length;
  for (let a = 0; a < s; a++) {
    const i = e[a];
    fr(i, o, r, t);
  }
}, fr = (e, o, r, t) => {
  if (typeof e == "string") {
    pr(e, o, r);
    return;
  }
  if (typeof e == "function") {
    br(e, o, r, t);
    return;
  }
  gr(e, o, r, t);
}, pr = (e, o, r) => {
  const t = e === "" ? o : Ie(o, e);
  t.classGroupId = r;
}, br = (e, o, r, t) => {
  if (hr(e)) {
    ve(e(t), o, r, t);
    return;
  }
  o.validators === null && (o.validators = []), o.validators.push(ir(r, e));
}, gr = (e, o, r, t) => {
  const s = Object.entries(e), a = s.length;
  for (let i = 0; i < a; i++) {
    const [u, d] = s[i];
    ve(d, Ie(o, u), r, t);
  }
}, Ie = (e, o) => {
  let r = e;
  const t = o.split(me), s = t.length;
  for (let a = 0; a < s; a++) {
    const i = t[a];
    let u = r.nextPart.get(i);
    u || (u = je(), r.nextPart.set(i, u)), r = u;
  }
  return r;
}, hr = (e) => "isThemeGetter" in e && e.isThemeGetter === !0, vr = (e) => {
  if (e < 1)
    return {
      get: () => {
      },
      set: () => {
      }
    };
  let o = 0, r = /* @__PURE__ */ Object.create(null), t = /* @__PURE__ */ Object.create(null);
  const s = (a, i) => {
    r[a] = i, o++, o > e && (o = 0, t = r, r = /* @__PURE__ */ Object.create(null));
  };
  return {
    get(a) {
      let i = r[a];
      if (i !== void 0)
        return i;
      if ((i = t[a]) !== void 0)
        return s(a, i), i;
    },
    set(a, i) {
      a in r ? r[a] = i : s(a, i);
    }
  };
}, he = "!", Se = ":", yr = [], Ce = (e, o, r, t, s) => ({
  modifiers: e,
  hasImportantModifier: o,
  baseClassName: r,
  maybePostfixModifierPosition: t,
  isExternal: s
}), kr = (e) => {
  const {
    prefix: o,
    experimentalParseClassName: r
  } = e;
  let t = (s) => {
    const a = [];
    let i = 0, u = 0, d = 0, f;
    const k = s.length;
    for (let _ = 0; _ < k; _++) {
      const w = s[_];
      if (i === 0 && u === 0) {
        if (w === Se) {
          a.push(s.slice(d, _)), d = _ + 1;
          continue;
        }
        if (w === "/") {
          f = _;
          continue;
        }
      }
      w === "[" ? i++ : w === "]" ? i-- : w === "(" ? u++ : w === ")" && u--;
    }
    const x = a.length === 0 ? s : s.slice(d);
    let R = x, C = !1;
    x.endsWith(he) ? (R = x.slice(0, -1), C = !0) : (
      /**
       * In Tailwind CSS v3 the important modifier was at the start of the base class name. This is still supported for legacy reasons.
       * @see https://github.com/dcastil/tailwind-merge/issues/513#issuecomment-2614029864
       */
      x.startsWith(he) && (R = x.slice(1), C = !0)
    );
    const T = f && f > d ? f - d : void 0;
    return Ce(a, C, R, T);
  };
  if (o) {
    const s = o + Se, a = t;
    t = (i) => i.startsWith(s) ? a(i.slice(s.length)) : Ce(yr, !1, i, void 0, !0);
  }
  if (r) {
    const s = t;
    t = (a) => r({
      className: a,
      parseClassName: s
    });
  }
  return t;
}, xr = (e) => {
  const o = /* @__PURE__ */ new Map();
  return e.orderSensitiveModifiers.forEach((r, t) => {
    o.set(r, 1e6 + t);
  }), (r) => {
    const t = [];
    let s = [];
    for (let a = 0; a < r.length; a++) {
      const i = r[a], u = i[0] === "[", d = o.has(i);
      u || d ? (s.length > 0 && (s.sort(), t.push(...s), s = []), t.push(i)) : s.push(i);
    }
    return s.length > 0 && (s.sort(), t.push(...s)), t;
  };
}, wr = (e) => ({
  cache: vr(e.cacheSize),
  parseClassName: kr(e),
  sortModifiers: xr(e),
  ...cr(e)
}), Rr = /\s+/, Er = (e, o) => {
  const {
    parseClassName: r,
    getClassGroupId: t,
    getConflictingClassGroupIds: s,
    sortModifiers: a
  } = o, i = [], u = e.trim().split(Rr);
  let d = "";
  for (let f = u.length - 1; f >= 0; f -= 1) {
    const k = u[f], {
      isExternal: x,
      modifiers: R,
      hasImportantModifier: C,
      baseClassName: T,
      maybePostfixModifierPosition: _
    } = r(k);
    if (x) {
      d = k + (d.length > 0 ? " " + d : d);
      continue;
    }
    let w = !!_, j = t(w ? T.substring(0, _) : T);
    if (!j) {
      if (!w) {
        d = k + (d.length > 0 ? " " + d : d);
        continue;
      }
      if (j = t(T), !j) {
        d = k + (d.length > 0 ? " " + d : d);
        continue;
      }
      w = !1;
    }
    const B = R.length === 0 ? "" : R.length === 1 ? R[0] : a(R).join(":"), Y = C ? B + he : B, L = Y + j;
    if (i.indexOf(L) > -1)
      continue;
    i.push(L);
    const G = s(j, w);
    for (let N = 0; N < G.length; ++N) {
      const D = G[N];
      i.push(Y + D);
    }
    d = k + (d.length > 0 ? " " + d : d);
  }
  return d;
}, _r = (...e) => {
  let o = 0, r, t, s = "";
  for (; o < e.length; )
    (r = e[o++]) && (t = Me(r)) && (s && (s += " "), s += t);
  return s;
}, Me = (e) => {
  if (typeof e == "string")
    return e;
  let o, r = "";
  for (let t = 0; t < e.length; t++)
    e[t] && (o = Me(e[t])) && (r && (r += " "), r += o);
  return r;
}, Sr = (e, ...o) => {
  let r, t, s, a;
  const i = (d) => {
    const f = o.reduce((k, x) => x(k), e());
    return r = wr(f), t = r.cache.get, s = r.cache.set, a = u, u(d);
  }, u = (d) => {
    const f = t(d);
    if (f)
      return f;
    const k = Er(d, r);
    return s(d, k), k;
  };
  return a = i, (...d) => a(_r(...d));
}, Cr = [], E = (e) => {
  const o = (r) => r[e] || Cr;
  return o.isThemeGetter = !0, o;
}, Ve = /^\[(?:(\w[\w-]*):)?(.+)\]$/i, Le = /^\((?:(\w[\w-]*):)?(.+)\)$/i, Ar = /^\d+\/\d+$/, Tr = /^(\d+(\.\d+)?)?(xs|sm|md|lg|xl)$/, Pr = /\d+(%|px|r?em|[sdl]?v([hwib]|min|max)|pt|pc|in|cm|mm|cap|ch|ex|r?lh|cq(w|h|i|b|min|max))|\b(calc|min|max|clamp)\(.+\)|^0$/, zr = /^(rgba?|hsla?|hwb|(ok)?(lab|lch)|color-mix)\(.+\)$/, Or = /^(inset_)?-?((\d+)?\.?(\d+)[a-z]+|0)_-?((\d+)?\.?(\d+)[a-z]+|0)/, jr = /^(url|image|image-set|cross-fade|element|(repeating-)?(linear|radial|conic)-gradient)\(.+\)$/, X = (e) => Ar.test(e), g = (e) => !!e && !Number.isNaN(Number(e)), W = (e) => !!e && Number.isInteger(Number(e)), pe = (e) => e.endsWith("%") && g(e.slice(0, -1)), V = (e) => Tr.test(e), Nr = () => !0, Ir = (e) => (
  // `colorFunctionRegex` check is necessary because color functions can have percentages in them which which would be incorrectly classified as lengths.
  // For example, `hsl(0 0% 0%)` would be classified as a length without this check.
  // I could also use lookbehind assertion in `lengthUnitRegex` but that isn't supported widely enough.
  Pr.test(e) && !zr.test(e)
), Ge = () => !1, Mr = (e) => Or.test(e), Vr = (e) => jr.test(e), Lr = (e) => !l(e) && !c(e), Gr = (e) => H(e, We, Ge), l = (e) => Ve.test(e), U = (e) => H(e, Ye, Ir), be = (e) => H(e, Dr, g), Ae = (e) => H(e, Fe, Ge), Fr = (e) => H(e, $e, Vr), ce = (e) => H(e, De, Mr), c = (e) => Le.test(e), ne = (e) => Z(e, Ye), $r = (e) => Z(e, Ur), Te = (e) => Z(e, Fe), Wr = (e) => Z(e, We), Yr = (e) => Z(e, $e), de = (e) => Z(e, De, !0), H = (e, o, r) => {
  const t = Ve.exec(e);
  return t ? t[1] ? o(t[1]) : r(t[2]) : !1;
}, Z = (e, o, r = !1) => {
  const t = Le.exec(e);
  return t ? t[1] ? o(t[1]) : r : !1;
}, Fe = (e) => e === "position" || e === "percentage", $e = (e) => e === "image" || e === "url", We = (e) => e === "length" || e === "size" || e === "bg-size", Ye = (e) => e === "length", Dr = (e) => e === "number", Ur = (e) => e === "family-name", De = (e) => e === "shadow", Br = () => {
  const e = E("color"), o = E("font"), r = E("text"), t = E("font-weight"), s = E("tracking"), a = E("leading"), i = E("breakpoint"), u = E("container"), d = E("spacing"), f = E("radius"), k = E("shadow"), x = E("inset-shadow"), R = E("text-shadow"), C = E("drop-shadow"), T = E("blur"), _ = E("perspective"), w = E("aspect"), j = E("ease"), B = E("animate"), Y = () => ["auto", "avoid", "all", "avoid-page", "page", "left", "right", "column"], L = () => [
    "center",
    "top",
    "bottom",
    "left",
    "right",
    "top-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-top",
    "top-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-top",
    "bottom-right",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "right-bottom",
    "bottom-left",
    // Deprecated since Tailwind CSS v4.1.0, see https://github.com/tailwindlabs/tailwindcss/pull/17378
    "left-bottom"
  ], G = () => [...L(), c, l], N = () => ["auto", "hidden", "clip", "visible", "scroll"], D = () => ["auto", "contain", "none"], p = () => [c, l, d], A = () => [X, "full", "auto", ...p()], se = () => [W, "none", "subgrid", c, l], ae = () => ["auto", {
    span: ["full", W, c, l]
  }, W, c, l], F = () => [W, "auto", c, l], Q = () => ["auto", "min", "max", "fr", c, l], K = () => ["start", "end", "center", "between", "around", "evenly", "stretch", "baseline", "center-safe", "end-safe"], z = () => ["start", "end", "center", "stretch", "center-safe", "end-safe"], P = () => ["auto", ...p()], O = () => [X, "auto", "full", "dvw", "dvh", "lvw", "lvh", "svw", "svh", "min", "max", "fit", ...p()], m = () => [e, c, l], ee = () => [...L(), Te, Ae, {
    position: [c, l]
  }], re = () => ["no-repeat", {
    repeat: ["", "x", "y", "space", "round"]
  }], n = () => ["auto", "cover", "contain", Wr, Gr, {
    size: [c, l]
  }], b = () => [pe, ne, U], h = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    "full",
    f,
    c,
    l
  ], y = () => ["", g, ne, U], I = () => ["solid", "dashed", "dotted", "double"], q = () => ["normal", "multiply", "screen", "overlay", "darken", "lighten", "color-dodge", "color-burn", "hard-light", "soft-light", "difference", "exclusion", "hue", "saturation", "color", "luminosity"], v = () => [g, pe, Te, Ae], M = () => [
    // Deprecated since Tailwind CSS v4.0.0
    "",
    "none",
    T,
    c,
    l
  ], $ = () => ["none", g, c, l], J = () => ["none", g, c, l], fe = () => [g, c, l], ie = () => [X, "full", ...p()];
  return {
    cacheSize: 500,
    theme: {
      animate: ["spin", "ping", "pulse", "bounce"],
      aspect: ["video"],
      blur: [V],
      breakpoint: [V],
      color: [Nr],
      container: [V],
      "drop-shadow": [V],
      ease: ["in", "out", "in-out"],
      font: [Lr],
      "font-weight": ["thin", "extralight", "light", "normal", "medium", "semibold", "bold", "extrabold", "black"],
      "inset-shadow": [V],
      leading: ["none", "tight", "snug", "normal", "relaxed", "loose"],
      perspective: ["dramatic", "near", "normal", "midrange", "distant", "none"],
      radius: [V],
      shadow: [V],
      spacing: ["px", g],
      text: [V],
      "text-shadow": [V],
      tracking: ["tighter", "tight", "normal", "wide", "wider", "widest"]
    },
    classGroups: {
      // --------------
      // --- Layout ---
      // --------------
      /**
       * Aspect Ratio
       * @see https://tailwindcss.com/docs/aspect-ratio
       */
      aspect: [{
        aspect: ["auto", "square", X, l, c, w]
      }],
      /**
       * Container
       * @see https://tailwindcss.com/docs/container
       * @deprecated since Tailwind CSS v4.0.0
       */
      container: ["container"],
      /**
       * Columns
       * @see https://tailwindcss.com/docs/columns
       */
      columns: [{
        columns: [g, l, c, u]
      }],
      /**
       * Break After
       * @see https://tailwindcss.com/docs/break-after
       */
      "break-after": [{
        "break-after": Y()
      }],
      /**
       * Break Before
       * @see https://tailwindcss.com/docs/break-before
       */
      "break-before": [{
        "break-before": Y()
      }],
      /**
       * Break Inside
       * @see https://tailwindcss.com/docs/break-inside
       */
      "break-inside": [{
        "break-inside": ["auto", "avoid", "avoid-page", "avoid-column"]
      }],
      /**
       * Box Decoration Break
       * @see https://tailwindcss.com/docs/box-decoration-break
       */
      "box-decoration": [{
        "box-decoration": ["slice", "clone"]
      }],
      /**
       * Box Sizing
       * @see https://tailwindcss.com/docs/box-sizing
       */
      box: [{
        box: ["border", "content"]
      }],
      /**
       * Display
       * @see https://tailwindcss.com/docs/display
       */
      display: ["block", "inline-block", "inline", "flex", "inline-flex", "table", "inline-table", "table-caption", "table-cell", "table-column", "table-column-group", "table-footer-group", "table-header-group", "table-row-group", "table-row", "flow-root", "grid", "inline-grid", "contents", "list-item", "hidden"],
      /**
       * Screen Reader Only
       * @see https://tailwindcss.com/docs/display#screen-reader-only
       */
      sr: ["sr-only", "not-sr-only"],
      /**
       * Floats
       * @see https://tailwindcss.com/docs/float
       */
      float: [{
        float: ["right", "left", "none", "start", "end"]
      }],
      /**
       * Clear
       * @see https://tailwindcss.com/docs/clear
       */
      clear: [{
        clear: ["left", "right", "both", "none", "start", "end"]
      }],
      /**
       * Isolation
       * @see https://tailwindcss.com/docs/isolation
       */
      isolation: ["isolate", "isolation-auto"],
      /**
       * Object Fit
       * @see https://tailwindcss.com/docs/object-fit
       */
      "object-fit": [{
        object: ["contain", "cover", "fill", "none", "scale-down"]
      }],
      /**
       * Object Position
       * @see https://tailwindcss.com/docs/object-position
       */
      "object-position": [{
        object: G()
      }],
      /**
       * Overflow
       * @see https://tailwindcss.com/docs/overflow
       */
      overflow: [{
        overflow: N()
      }],
      /**
       * Overflow X
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-x": [{
        "overflow-x": N()
      }],
      /**
       * Overflow Y
       * @see https://tailwindcss.com/docs/overflow
       */
      "overflow-y": [{
        "overflow-y": N()
      }],
      /**
       * Overscroll Behavior
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      overscroll: [{
        overscroll: D()
      }],
      /**
       * Overscroll Behavior X
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-x": [{
        "overscroll-x": D()
      }],
      /**
       * Overscroll Behavior Y
       * @see https://tailwindcss.com/docs/overscroll-behavior
       */
      "overscroll-y": [{
        "overscroll-y": D()
      }],
      /**
       * Position
       * @see https://tailwindcss.com/docs/position
       */
      position: ["static", "fixed", "absolute", "relative", "sticky"],
      /**
       * Top / Right / Bottom / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      inset: [{
        inset: A()
      }],
      /**
       * Right / Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-x": [{
        "inset-x": A()
      }],
      /**
       * Top / Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      "inset-y": [{
        "inset-y": A()
      }],
      /**
       * Start
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      start: [{
        start: A()
      }],
      /**
       * End
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      end: [{
        end: A()
      }],
      /**
       * Top
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      top: [{
        top: A()
      }],
      /**
       * Right
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      right: [{
        right: A()
      }],
      /**
       * Bottom
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      bottom: [{
        bottom: A()
      }],
      /**
       * Left
       * @see https://tailwindcss.com/docs/top-right-bottom-left
       */
      left: [{
        left: A()
      }],
      /**
       * Visibility
       * @see https://tailwindcss.com/docs/visibility
       */
      visibility: ["visible", "invisible", "collapse"],
      /**
       * Z-Index
       * @see https://tailwindcss.com/docs/z-index
       */
      z: [{
        z: [W, "auto", c, l]
      }],
      // ------------------------
      // --- Flexbox and Grid ---
      // ------------------------
      /**
       * Flex Basis
       * @see https://tailwindcss.com/docs/flex-basis
       */
      basis: [{
        basis: [X, "full", "auto", u, ...p()]
      }],
      /**
       * Flex Direction
       * @see https://tailwindcss.com/docs/flex-direction
       */
      "flex-direction": [{
        flex: ["row", "row-reverse", "col", "col-reverse"]
      }],
      /**
       * Flex Wrap
       * @see https://tailwindcss.com/docs/flex-wrap
       */
      "flex-wrap": [{
        flex: ["nowrap", "wrap", "wrap-reverse"]
      }],
      /**
       * Flex
       * @see https://tailwindcss.com/docs/flex
       */
      flex: [{
        flex: [g, X, "auto", "initial", "none", l]
      }],
      /**
       * Flex Grow
       * @see https://tailwindcss.com/docs/flex-grow
       */
      grow: [{
        grow: ["", g, c, l]
      }],
      /**
       * Flex Shrink
       * @see https://tailwindcss.com/docs/flex-shrink
       */
      shrink: [{
        shrink: ["", g, c, l]
      }],
      /**
       * Order
       * @see https://tailwindcss.com/docs/order
       */
      order: [{
        order: [W, "first", "last", "none", c, l]
      }],
      /**
       * Grid Template Columns
       * @see https://tailwindcss.com/docs/grid-template-columns
       */
      "grid-cols": [{
        "grid-cols": se()
      }],
      /**
       * Grid Column Start / End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start-end": [{
        col: ae()
      }],
      /**
       * Grid Column Start
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-start": [{
        "col-start": F()
      }],
      /**
       * Grid Column End
       * @see https://tailwindcss.com/docs/grid-column
       */
      "col-end": [{
        "col-end": F()
      }],
      /**
       * Grid Template Rows
       * @see https://tailwindcss.com/docs/grid-template-rows
       */
      "grid-rows": [{
        "grid-rows": se()
      }],
      /**
       * Grid Row Start / End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start-end": [{
        row: ae()
      }],
      /**
       * Grid Row Start
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-start": [{
        "row-start": F()
      }],
      /**
       * Grid Row End
       * @see https://tailwindcss.com/docs/grid-row
       */
      "row-end": [{
        "row-end": F()
      }],
      /**
       * Grid Auto Flow
       * @see https://tailwindcss.com/docs/grid-auto-flow
       */
      "grid-flow": [{
        "grid-flow": ["row", "col", "dense", "row-dense", "col-dense"]
      }],
      /**
       * Grid Auto Columns
       * @see https://tailwindcss.com/docs/grid-auto-columns
       */
      "auto-cols": [{
        "auto-cols": Q()
      }],
      /**
       * Grid Auto Rows
       * @see https://tailwindcss.com/docs/grid-auto-rows
       */
      "auto-rows": [{
        "auto-rows": Q()
      }],
      /**
       * Gap
       * @see https://tailwindcss.com/docs/gap
       */
      gap: [{
        gap: p()
      }],
      /**
       * Gap X
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-x": [{
        "gap-x": p()
      }],
      /**
       * Gap Y
       * @see https://tailwindcss.com/docs/gap
       */
      "gap-y": [{
        "gap-y": p()
      }],
      /**
       * Justify Content
       * @see https://tailwindcss.com/docs/justify-content
       */
      "justify-content": [{
        justify: [...K(), "normal"]
      }],
      /**
       * Justify Items
       * @see https://tailwindcss.com/docs/justify-items
       */
      "justify-items": [{
        "justify-items": [...z(), "normal"]
      }],
      /**
       * Justify Self
       * @see https://tailwindcss.com/docs/justify-self
       */
      "justify-self": [{
        "justify-self": ["auto", ...z()]
      }],
      /**
       * Align Content
       * @see https://tailwindcss.com/docs/align-content
       */
      "align-content": [{
        content: ["normal", ...K()]
      }],
      /**
       * Align Items
       * @see https://tailwindcss.com/docs/align-items
       */
      "align-items": [{
        items: [...z(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Align Self
       * @see https://tailwindcss.com/docs/align-self
       */
      "align-self": [{
        self: ["auto", ...z(), {
          baseline: ["", "last"]
        }]
      }],
      /**
       * Place Content
       * @see https://tailwindcss.com/docs/place-content
       */
      "place-content": [{
        "place-content": K()
      }],
      /**
       * Place Items
       * @see https://tailwindcss.com/docs/place-items
       */
      "place-items": [{
        "place-items": [...z(), "baseline"]
      }],
      /**
       * Place Self
       * @see https://tailwindcss.com/docs/place-self
       */
      "place-self": [{
        "place-self": ["auto", ...z()]
      }],
      // Spacing
      /**
       * Padding
       * @see https://tailwindcss.com/docs/padding
       */
      p: [{
        p: p()
      }],
      /**
       * Padding X
       * @see https://tailwindcss.com/docs/padding
       */
      px: [{
        px: p()
      }],
      /**
       * Padding Y
       * @see https://tailwindcss.com/docs/padding
       */
      py: [{
        py: p()
      }],
      /**
       * Padding Start
       * @see https://tailwindcss.com/docs/padding
       */
      ps: [{
        ps: p()
      }],
      /**
       * Padding End
       * @see https://tailwindcss.com/docs/padding
       */
      pe: [{
        pe: p()
      }],
      /**
       * Padding Top
       * @see https://tailwindcss.com/docs/padding
       */
      pt: [{
        pt: p()
      }],
      /**
       * Padding Right
       * @see https://tailwindcss.com/docs/padding
       */
      pr: [{
        pr: p()
      }],
      /**
       * Padding Bottom
       * @see https://tailwindcss.com/docs/padding
       */
      pb: [{
        pb: p()
      }],
      /**
       * Padding Left
       * @see https://tailwindcss.com/docs/padding
       */
      pl: [{
        pl: p()
      }],
      /**
       * Margin
       * @see https://tailwindcss.com/docs/margin
       */
      m: [{
        m: P()
      }],
      /**
       * Margin X
       * @see https://tailwindcss.com/docs/margin
       */
      mx: [{
        mx: P()
      }],
      /**
       * Margin Y
       * @see https://tailwindcss.com/docs/margin
       */
      my: [{
        my: P()
      }],
      /**
       * Margin Start
       * @see https://tailwindcss.com/docs/margin
       */
      ms: [{
        ms: P()
      }],
      /**
       * Margin End
       * @see https://tailwindcss.com/docs/margin
       */
      me: [{
        me: P()
      }],
      /**
       * Margin Top
       * @see https://tailwindcss.com/docs/margin
       */
      mt: [{
        mt: P()
      }],
      /**
       * Margin Right
       * @see https://tailwindcss.com/docs/margin
       */
      mr: [{
        mr: P()
      }],
      /**
       * Margin Bottom
       * @see https://tailwindcss.com/docs/margin
       */
      mb: [{
        mb: P()
      }],
      /**
       * Margin Left
       * @see https://tailwindcss.com/docs/margin
       */
      ml: [{
        ml: P()
      }],
      /**
       * Space Between X
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x": [{
        "space-x": p()
      }],
      /**
       * Space Between X Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-x-reverse": ["space-x-reverse"],
      /**
       * Space Between Y
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y": [{
        "space-y": p()
      }],
      /**
       * Space Between Y Reverse
       * @see https://tailwindcss.com/docs/margin#adding-space-between-children
       */
      "space-y-reverse": ["space-y-reverse"],
      // --------------
      // --- Sizing ---
      // --------------
      /**
       * Size
       * @see https://tailwindcss.com/docs/width#setting-both-width-and-height
       */
      size: [{
        size: O()
      }],
      /**
       * Width
       * @see https://tailwindcss.com/docs/width
       */
      w: [{
        w: [u, "screen", ...O()]
      }],
      /**
       * Min-Width
       * @see https://tailwindcss.com/docs/min-width
       */
      "min-w": [{
        "min-w": [
          u,
          "screen",
          /** Deprecated. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "none",
          ...O()
        ]
      }],
      /**
       * Max-Width
       * @see https://tailwindcss.com/docs/max-width
       */
      "max-w": [{
        "max-w": [
          u,
          "screen",
          "none",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          "prose",
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          {
            screen: [i]
          },
          ...O()
        ]
      }],
      /**
       * Height
       * @see https://tailwindcss.com/docs/height
       */
      h: [{
        h: ["screen", "lh", ...O()]
      }],
      /**
       * Min-Height
       * @see https://tailwindcss.com/docs/min-height
       */
      "min-h": [{
        "min-h": ["screen", "lh", "none", ...O()]
      }],
      /**
       * Max-Height
       * @see https://tailwindcss.com/docs/max-height
       */
      "max-h": [{
        "max-h": ["screen", "lh", ...O()]
      }],
      // ------------------
      // --- Typography ---
      // ------------------
      /**
       * Font Size
       * @see https://tailwindcss.com/docs/font-size
       */
      "font-size": [{
        text: ["base", r, ne, U]
      }],
      /**
       * Font Smoothing
       * @see https://tailwindcss.com/docs/font-smoothing
       */
      "font-smoothing": ["antialiased", "subpixel-antialiased"],
      /**
       * Font Style
       * @see https://tailwindcss.com/docs/font-style
       */
      "font-style": ["italic", "not-italic"],
      /**
       * Font Weight
       * @see https://tailwindcss.com/docs/font-weight
       */
      "font-weight": [{
        font: [t, c, be]
      }],
      /**
       * Font Stretch
       * @see https://tailwindcss.com/docs/font-stretch
       */
      "font-stretch": [{
        "font-stretch": ["ultra-condensed", "extra-condensed", "condensed", "semi-condensed", "normal", "semi-expanded", "expanded", "extra-expanded", "ultra-expanded", pe, l]
      }],
      /**
       * Font Family
       * @see https://tailwindcss.com/docs/font-family
       */
      "font-family": [{
        font: [$r, l, o]
      }],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-normal": ["normal-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-ordinal": ["ordinal"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-slashed-zero": ["slashed-zero"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-figure": ["lining-nums", "oldstyle-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-spacing": ["proportional-nums", "tabular-nums"],
      /**
       * Font Variant Numeric
       * @see https://tailwindcss.com/docs/font-variant-numeric
       */
      "fvn-fraction": ["diagonal-fractions", "stacked-fractions"],
      /**
       * Letter Spacing
       * @see https://tailwindcss.com/docs/letter-spacing
       */
      tracking: [{
        tracking: [s, c, l]
      }],
      /**
       * Line Clamp
       * @see https://tailwindcss.com/docs/line-clamp
       */
      "line-clamp": [{
        "line-clamp": [g, "none", c, be]
      }],
      /**
       * Line Height
       * @see https://tailwindcss.com/docs/line-height
       */
      leading: [{
        leading: [
          /** Deprecated since Tailwind CSS v4.0.0. @see https://github.com/tailwindlabs/tailwindcss.com/issues/2027#issuecomment-2620152757 */
          a,
          ...p()
        ]
      }],
      /**
       * List Style Image
       * @see https://tailwindcss.com/docs/list-style-image
       */
      "list-image": [{
        "list-image": ["none", c, l]
      }],
      /**
       * List Style Position
       * @see https://tailwindcss.com/docs/list-style-position
       */
      "list-style-position": [{
        list: ["inside", "outside"]
      }],
      /**
       * List Style Type
       * @see https://tailwindcss.com/docs/list-style-type
       */
      "list-style-type": [{
        list: ["disc", "decimal", "none", c, l]
      }],
      /**
       * Text Alignment
       * @see https://tailwindcss.com/docs/text-align
       */
      "text-alignment": [{
        text: ["left", "center", "right", "justify", "start", "end"]
      }],
      /**
       * Placeholder Color
       * @deprecated since Tailwind CSS v3.0.0
       * @see https://v3.tailwindcss.com/docs/placeholder-color
       */
      "placeholder-color": [{
        placeholder: m()
      }],
      /**
       * Text Color
       * @see https://tailwindcss.com/docs/text-color
       */
      "text-color": [{
        text: m()
      }],
      /**
       * Text Decoration
       * @see https://tailwindcss.com/docs/text-decoration
       */
      "text-decoration": ["underline", "overline", "line-through", "no-underline"],
      /**
       * Text Decoration Style
       * @see https://tailwindcss.com/docs/text-decoration-style
       */
      "text-decoration-style": [{
        decoration: [...I(), "wavy"]
      }],
      /**
       * Text Decoration Thickness
       * @see https://tailwindcss.com/docs/text-decoration-thickness
       */
      "text-decoration-thickness": [{
        decoration: [g, "from-font", "auto", c, U]
      }],
      /**
       * Text Decoration Color
       * @see https://tailwindcss.com/docs/text-decoration-color
       */
      "text-decoration-color": [{
        decoration: m()
      }],
      /**
       * Text Underline Offset
       * @see https://tailwindcss.com/docs/text-underline-offset
       */
      "underline-offset": [{
        "underline-offset": [g, "auto", c, l]
      }],
      /**
       * Text Transform
       * @see https://tailwindcss.com/docs/text-transform
       */
      "text-transform": ["uppercase", "lowercase", "capitalize", "normal-case"],
      /**
       * Text Overflow
       * @see https://tailwindcss.com/docs/text-overflow
       */
      "text-overflow": ["truncate", "text-ellipsis", "text-clip"],
      /**
       * Text Wrap
       * @see https://tailwindcss.com/docs/text-wrap
       */
      "text-wrap": [{
        text: ["wrap", "nowrap", "balance", "pretty"]
      }],
      /**
       * Text Indent
       * @see https://tailwindcss.com/docs/text-indent
       */
      indent: [{
        indent: p()
      }],
      /**
       * Vertical Alignment
       * @see https://tailwindcss.com/docs/vertical-align
       */
      "vertical-align": [{
        align: ["baseline", "top", "middle", "bottom", "text-top", "text-bottom", "sub", "super", c, l]
      }],
      /**
       * Whitespace
       * @see https://tailwindcss.com/docs/whitespace
       */
      whitespace: [{
        whitespace: ["normal", "nowrap", "pre", "pre-line", "pre-wrap", "break-spaces"]
      }],
      /**
       * Word Break
       * @see https://tailwindcss.com/docs/word-break
       */
      break: [{
        break: ["normal", "words", "all", "keep"]
      }],
      /**
       * Overflow Wrap
       * @see https://tailwindcss.com/docs/overflow-wrap
       */
      wrap: [{
        wrap: ["break-word", "anywhere", "normal"]
      }],
      /**
       * Hyphens
       * @see https://tailwindcss.com/docs/hyphens
       */
      hyphens: [{
        hyphens: ["none", "manual", "auto"]
      }],
      /**
       * Content
       * @see https://tailwindcss.com/docs/content
       */
      content: [{
        content: ["none", c, l]
      }],
      // -------------------
      // --- Backgrounds ---
      // -------------------
      /**
       * Background Attachment
       * @see https://tailwindcss.com/docs/background-attachment
       */
      "bg-attachment": [{
        bg: ["fixed", "local", "scroll"]
      }],
      /**
       * Background Clip
       * @see https://tailwindcss.com/docs/background-clip
       */
      "bg-clip": [{
        "bg-clip": ["border", "padding", "content", "text"]
      }],
      /**
       * Background Origin
       * @see https://tailwindcss.com/docs/background-origin
       */
      "bg-origin": [{
        "bg-origin": ["border", "padding", "content"]
      }],
      /**
       * Background Position
       * @see https://tailwindcss.com/docs/background-position
       */
      "bg-position": [{
        bg: ee()
      }],
      /**
       * Background Repeat
       * @see https://tailwindcss.com/docs/background-repeat
       */
      "bg-repeat": [{
        bg: re()
      }],
      /**
       * Background Size
       * @see https://tailwindcss.com/docs/background-size
       */
      "bg-size": [{
        bg: n()
      }],
      /**
       * Background Image
       * @see https://tailwindcss.com/docs/background-image
       */
      "bg-image": [{
        bg: ["none", {
          linear: [{
            to: ["t", "tr", "r", "br", "b", "bl", "l", "tl"]
          }, W, c, l],
          radial: ["", c, l],
          conic: [W, c, l]
        }, Yr, Fr]
      }],
      /**
       * Background Color
       * @see https://tailwindcss.com/docs/background-color
       */
      "bg-color": [{
        bg: m()
      }],
      /**
       * Gradient Color Stops From Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from-pos": [{
        from: b()
      }],
      /**
       * Gradient Color Stops Via Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via-pos": [{
        via: b()
      }],
      /**
       * Gradient Color Stops To Position
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to-pos": [{
        to: b()
      }],
      /**
       * Gradient Color Stops From
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-from": [{
        from: m()
      }],
      /**
       * Gradient Color Stops Via
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-via": [{
        via: m()
      }],
      /**
       * Gradient Color Stops To
       * @see https://tailwindcss.com/docs/gradient-color-stops
       */
      "gradient-to": [{
        to: m()
      }],
      // ---------------
      // --- Borders ---
      // ---------------
      /**
       * Border Radius
       * @see https://tailwindcss.com/docs/border-radius
       */
      rounded: [{
        rounded: h()
      }],
      /**
       * Border Radius Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-s": [{
        "rounded-s": h()
      }],
      /**
       * Border Radius End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-e": [{
        "rounded-e": h()
      }],
      /**
       * Border Radius Top
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-t": [{
        "rounded-t": h()
      }],
      /**
       * Border Radius Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-r": [{
        "rounded-r": h()
      }],
      /**
       * Border Radius Bottom
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-b": [{
        "rounded-b": h()
      }],
      /**
       * Border Radius Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-l": [{
        "rounded-l": h()
      }],
      /**
       * Border Radius Start Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ss": [{
        "rounded-ss": h()
      }],
      /**
       * Border Radius Start End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-se": [{
        "rounded-se": h()
      }],
      /**
       * Border Radius End End
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-ee": [{
        "rounded-ee": h()
      }],
      /**
       * Border Radius End Start
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-es": [{
        "rounded-es": h()
      }],
      /**
       * Border Radius Top Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tl": [{
        "rounded-tl": h()
      }],
      /**
       * Border Radius Top Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-tr": [{
        "rounded-tr": h()
      }],
      /**
       * Border Radius Bottom Right
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-br": [{
        "rounded-br": h()
      }],
      /**
       * Border Radius Bottom Left
       * @see https://tailwindcss.com/docs/border-radius
       */
      "rounded-bl": [{
        "rounded-bl": h()
      }],
      /**
       * Border Width
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w": [{
        border: y()
      }],
      /**
       * Border Width X
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-x": [{
        "border-x": y()
      }],
      /**
       * Border Width Y
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-y": [{
        "border-y": y()
      }],
      /**
       * Border Width Start
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-s": [{
        "border-s": y()
      }],
      /**
       * Border Width End
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-e": [{
        "border-e": y()
      }],
      /**
       * Border Width Top
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-t": [{
        "border-t": y()
      }],
      /**
       * Border Width Right
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-r": [{
        "border-r": y()
      }],
      /**
       * Border Width Bottom
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-b": [{
        "border-b": y()
      }],
      /**
       * Border Width Left
       * @see https://tailwindcss.com/docs/border-width
       */
      "border-w-l": [{
        "border-l": y()
      }],
      /**
       * Divide Width X
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x": [{
        "divide-x": y()
      }],
      /**
       * Divide Width X Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-x-reverse": ["divide-x-reverse"],
      /**
       * Divide Width Y
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y": [{
        "divide-y": y()
      }],
      /**
       * Divide Width Y Reverse
       * @see https://tailwindcss.com/docs/border-width#between-children
       */
      "divide-y-reverse": ["divide-y-reverse"],
      /**
       * Border Style
       * @see https://tailwindcss.com/docs/border-style
       */
      "border-style": [{
        border: [...I(), "hidden", "none"]
      }],
      /**
       * Divide Style
       * @see https://tailwindcss.com/docs/border-style#setting-the-divider-style
       */
      "divide-style": [{
        divide: [...I(), "hidden", "none"]
      }],
      /**
       * Border Color
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color": [{
        border: m()
      }],
      /**
       * Border Color X
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-x": [{
        "border-x": m()
      }],
      /**
       * Border Color Y
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-y": [{
        "border-y": m()
      }],
      /**
       * Border Color S
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-s": [{
        "border-s": m()
      }],
      /**
       * Border Color E
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-e": [{
        "border-e": m()
      }],
      /**
       * Border Color Top
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-t": [{
        "border-t": m()
      }],
      /**
       * Border Color Right
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-r": [{
        "border-r": m()
      }],
      /**
       * Border Color Bottom
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-b": [{
        "border-b": m()
      }],
      /**
       * Border Color Left
       * @see https://tailwindcss.com/docs/border-color
       */
      "border-color-l": [{
        "border-l": m()
      }],
      /**
       * Divide Color
       * @see https://tailwindcss.com/docs/divide-color
       */
      "divide-color": [{
        divide: m()
      }],
      /**
       * Outline Style
       * @see https://tailwindcss.com/docs/outline-style
       */
      "outline-style": [{
        outline: [...I(), "none", "hidden"]
      }],
      /**
       * Outline Offset
       * @see https://tailwindcss.com/docs/outline-offset
       */
      "outline-offset": [{
        "outline-offset": [g, c, l]
      }],
      /**
       * Outline Width
       * @see https://tailwindcss.com/docs/outline-width
       */
      "outline-w": [{
        outline: ["", g, ne, U]
      }],
      /**
       * Outline Color
       * @see https://tailwindcss.com/docs/outline-color
       */
      "outline-color": [{
        outline: m()
      }],
      // ---------------
      // --- Effects ---
      // ---------------
      /**
       * Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow
       */
      shadow: [{
        shadow: [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          k,
          de,
          ce
        ]
      }],
      /**
       * Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-shadow-color
       */
      "shadow-color": [{
        shadow: m()
      }],
      /**
       * Inset Box Shadow
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-shadow
       */
      "inset-shadow": [{
        "inset-shadow": ["none", x, de, ce]
      }],
      /**
       * Inset Box Shadow Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-shadow-color
       */
      "inset-shadow-color": [{
        "inset-shadow": m()
      }],
      /**
       * Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-a-ring
       */
      "ring-w": [{
        ring: y()
      }],
      /**
       * Ring Width Inset
       * @see https://v3.tailwindcss.com/docs/ring-width#inset-rings
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-w-inset": ["ring-inset"],
      /**
       * Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-ring-color
       */
      "ring-color": [{
        ring: m()
      }],
      /**
       * Ring Offset Width
       * @see https://v3.tailwindcss.com/docs/ring-offset-width
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-w": [{
        "ring-offset": [g, U]
      }],
      /**
       * Ring Offset Color
       * @see https://v3.tailwindcss.com/docs/ring-offset-color
       * @deprecated since Tailwind CSS v4.0.0
       * @see https://github.com/tailwindlabs/tailwindcss/blob/v4.0.0/packages/tailwindcss/src/utilities.ts#L4158
       */
      "ring-offset-color": [{
        "ring-offset": m()
      }],
      /**
       * Inset Ring Width
       * @see https://tailwindcss.com/docs/box-shadow#adding-an-inset-ring
       */
      "inset-ring-w": [{
        "inset-ring": y()
      }],
      /**
       * Inset Ring Color
       * @see https://tailwindcss.com/docs/box-shadow#setting-the-inset-ring-color
       */
      "inset-ring-color": [{
        "inset-ring": m()
      }],
      /**
       * Text Shadow
       * @see https://tailwindcss.com/docs/text-shadow
       */
      "text-shadow": [{
        "text-shadow": ["none", R, de, ce]
      }],
      /**
       * Text Shadow Color
       * @see https://tailwindcss.com/docs/text-shadow#setting-the-shadow-color
       */
      "text-shadow-color": [{
        "text-shadow": m()
      }],
      /**
       * Opacity
       * @see https://tailwindcss.com/docs/opacity
       */
      opacity: [{
        opacity: [g, c, l]
      }],
      /**
       * Mix Blend Mode
       * @see https://tailwindcss.com/docs/mix-blend-mode
       */
      "mix-blend": [{
        "mix-blend": [...q(), "plus-darker", "plus-lighter"]
      }],
      /**
       * Background Blend Mode
       * @see https://tailwindcss.com/docs/background-blend-mode
       */
      "bg-blend": [{
        "bg-blend": q()
      }],
      /**
       * Mask Clip
       * @see https://tailwindcss.com/docs/mask-clip
       */
      "mask-clip": [{
        "mask-clip": ["border", "padding", "content", "fill", "stroke", "view"]
      }, "mask-no-clip"],
      /**
       * Mask Composite
       * @see https://tailwindcss.com/docs/mask-composite
       */
      "mask-composite": [{
        mask: ["add", "subtract", "intersect", "exclude"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image-linear-pos": [{
        "mask-linear": [g]
      }],
      "mask-image-linear-from-pos": [{
        "mask-linear-from": v()
      }],
      "mask-image-linear-to-pos": [{
        "mask-linear-to": v()
      }],
      "mask-image-linear-from-color": [{
        "mask-linear-from": m()
      }],
      "mask-image-linear-to-color": [{
        "mask-linear-to": m()
      }],
      "mask-image-t-from-pos": [{
        "mask-t-from": v()
      }],
      "mask-image-t-to-pos": [{
        "mask-t-to": v()
      }],
      "mask-image-t-from-color": [{
        "mask-t-from": m()
      }],
      "mask-image-t-to-color": [{
        "mask-t-to": m()
      }],
      "mask-image-r-from-pos": [{
        "mask-r-from": v()
      }],
      "mask-image-r-to-pos": [{
        "mask-r-to": v()
      }],
      "mask-image-r-from-color": [{
        "mask-r-from": m()
      }],
      "mask-image-r-to-color": [{
        "mask-r-to": m()
      }],
      "mask-image-b-from-pos": [{
        "mask-b-from": v()
      }],
      "mask-image-b-to-pos": [{
        "mask-b-to": v()
      }],
      "mask-image-b-from-color": [{
        "mask-b-from": m()
      }],
      "mask-image-b-to-color": [{
        "mask-b-to": m()
      }],
      "mask-image-l-from-pos": [{
        "mask-l-from": v()
      }],
      "mask-image-l-to-pos": [{
        "mask-l-to": v()
      }],
      "mask-image-l-from-color": [{
        "mask-l-from": m()
      }],
      "mask-image-l-to-color": [{
        "mask-l-to": m()
      }],
      "mask-image-x-from-pos": [{
        "mask-x-from": v()
      }],
      "mask-image-x-to-pos": [{
        "mask-x-to": v()
      }],
      "mask-image-x-from-color": [{
        "mask-x-from": m()
      }],
      "mask-image-x-to-color": [{
        "mask-x-to": m()
      }],
      "mask-image-y-from-pos": [{
        "mask-y-from": v()
      }],
      "mask-image-y-to-pos": [{
        "mask-y-to": v()
      }],
      "mask-image-y-from-color": [{
        "mask-y-from": m()
      }],
      "mask-image-y-to-color": [{
        "mask-y-to": m()
      }],
      "mask-image-radial": [{
        "mask-radial": [c, l]
      }],
      "mask-image-radial-from-pos": [{
        "mask-radial-from": v()
      }],
      "mask-image-radial-to-pos": [{
        "mask-radial-to": v()
      }],
      "mask-image-radial-from-color": [{
        "mask-radial-from": m()
      }],
      "mask-image-radial-to-color": [{
        "mask-radial-to": m()
      }],
      "mask-image-radial-shape": [{
        "mask-radial": ["circle", "ellipse"]
      }],
      "mask-image-radial-size": [{
        "mask-radial": [{
          closest: ["side", "corner"],
          farthest: ["side", "corner"]
        }]
      }],
      "mask-image-radial-pos": [{
        "mask-radial-at": L()
      }],
      "mask-image-conic-pos": [{
        "mask-conic": [g]
      }],
      "mask-image-conic-from-pos": [{
        "mask-conic-from": v()
      }],
      "mask-image-conic-to-pos": [{
        "mask-conic-to": v()
      }],
      "mask-image-conic-from-color": [{
        "mask-conic-from": m()
      }],
      "mask-image-conic-to-color": [{
        "mask-conic-to": m()
      }],
      /**
       * Mask Mode
       * @see https://tailwindcss.com/docs/mask-mode
       */
      "mask-mode": [{
        mask: ["alpha", "luminance", "match"]
      }],
      /**
       * Mask Origin
       * @see https://tailwindcss.com/docs/mask-origin
       */
      "mask-origin": [{
        "mask-origin": ["border", "padding", "content", "fill", "stroke", "view"]
      }],
      /**
       * Mask Position
       * @see https://tailwindcss.com/docs/mask-position
       */
      "mask-position": [{
        mask: ee()
      }],
      /**
       * Mask Repeat
       * @see https://tailwindcss.com/docs/mask-repeat
       */
      "mask-repeat": [{
        mask: re()
      }],
      /**
       * Mask Size
       * @see https://tailwindcss.com/docs/mask-size
       */
      "mask-size": [{
        mask: n()
      }],
      /**
       * Mask Type
       * @see https://tailwindcss.com/docs/mask-type
       */
      "mask-type": [{
        "mask-type": ["alpha", "luminance"]
      }],
      /**
       * Mask Image
       * @see https://tailwindcss.com/docs/mask-image
       */
      "mask-image": [{
        mask: ["none", c, l]
      }],
      // ---------------
      // --- Filters ---
      // ---------------
      /**
       * Filter
       * @see https://tailwindcss.com/docs/filter
       */
      filter: [{
        filter: [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          c,
          l
        ]
      }],
      /**
       * Blur
       * @see https://tailwindcss.com/docs/blur
       */
      blur: [{
        blur: M()
      }],
      /**
       * Brightness
       * @see https://tailwindcss.com/docs/brightness
       */
      brightness: [{
        brightness: [g, c, l]
      }],
      /**
       * Contrast
       * @see https://tailwindcss.com/docs/contrast
       */
      contrast: [{
        contrast: [g, c, l]
      }],
      /**
       * Drop Shadow
       * @see https://tailwindcss.com/docs/drop-shadow
       */
      "drop-shadow": [{
        "drop-shadow": [
          // Deprecated since Tailwind CSS v4.0.0
          "",
          "none",
          C,
          de,
          ce
        ]
      }],
      /**
       * Drop Shadow Color
       * @see https://tailwindcss.com/docs/filter-drop-shadow#setting-the-shadow-color
       */
      "drop-shadow-color": [{
        "drop-shadow": m()
      }],
      /**
       * Grayscale
       * @see https://tailwindcss.com/docs/grayscale
       */
      grayscale: [{
        grayscale: ["", g, c, l]
      }],
      /**
       * Hue Rotate
       * @see https://tailwindcss.com/docs/hue-rotate
       */
      "hue-rotate": [{
        "hue-rotate": [g, c, l]
      }],
      /**
       * Invert
       * @see https://tailwindcss.com/docs/invert
       */
      invert: [{
        invert: ["", g, c, l]
      }],
      /**
       * Saturate
       * @see https://tailwindcss.com/docs/saturate
       */
      saturate: [{
        saturate: [g, c, l]
      }],
      /**
       * Sepia
       * @see https://tailwindcss.com/docs/sepia
       */
      sepia: [{
        sepia: ["", g, c, l]
      }],
      /**
       * Backdrop Filter
       * @see https://tailwindcss.com/docs/backdrop-filter
       */
      "backdrop-filter": [{
        "backdrop-filter": [
          // Deprecated since Tailwind CSS v3.0.0
          "",
          "none",
          c,
          l
        ]
      }],
      /**
       * Backdrop Blur
       * @see https://tailwindcss.com/docs/backdrop-blur
       */
      "backdrop-blur": [{
        "backdrop-blur": M()
      }],
      /**
       * Backdrop Brightness
       * @see https://tailwindcss.com/docs/backdrop-brightness
       */
      "backdrop-brightness": [{
        "backdrop-brightness": [g, c, l]
      }],
      /**
       * Backdrop Contrast
       * @see https://tailwindcss.com/docs/backdrop-contrast
       */
      "backdrop-contrast": [{
        "backdrop-contrast": [g, c, l]
      }],
      /**
       * Backdrop Grayscale
       * @see https://tailwindcss.com/docs/backdrop-grayscale
       */
      "backdrop-grayscale": [{
        "backdrop-grayscale": ["", g, c, l]
      }],
      /**
       * Backdrop Hue Rotate
       * @see https://tailwindcss.com/docs/backdrop-hue-rotate
       */
      "backdrop-hue-rotate": [{
        "backdrop-hue-rotate": [g, c, l]
      }],
      /**
       * Backdrop Invert
       * @see https://tailwindcss.com/docs/backdrop-invert
       */
      "backdrop-invert": [{
        "backdrop-invert": ["", g, c, l]
      }],
      /**
       * Backdrop Opacity
       * @see https://tailwindcss.com/docs/backdrop-opacity
       */
      "backdrop-opacity": [{
        "backdrop-opacity": [g, c, l]
      }],
      /**
       * Backdrop Saturate
       * @see https://tailwindcss.com/docs/backdrop-saturate
       */
      "backdrop-saturate": [{
        "backdrop-saturate": [g, c, l]
      }],
      /**
       * Backdrop Sepia
       * @see https://tailwindcss.com/docs/backdrop-sepia
       */
      "backdrop-sepia": [{
        "backdrop-sepia": ["", g, c, l]
      }],
      // --------------
      // --- Tables ---
      // --------------
      /**
       * Border Collapse
       * @see https://tailwindcss.com/docs/border-collapse
       */
      "border-collapse": [{
        border: ["collapse", "separate"]
      }],
      /**
       * Border Spacing
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing": [{
        "border-spacing": p()
      }],
      /**
       * Border Spacing X
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-x": [{
        "border-spacing-x": p()
      }],
      /**
       * Border Spacing Y
       * @see https://tailwindcss.com/docs/border-spacing
       */
      "border-spacing-y": [{
        "border-spacing-y": p()
      }],
      /**
       * Table Layout
       * @see https://tailwindcss.com/docs/table-layout
       */
      "table-layout": [{
        table: ["auto", "fixed"]
      }],
      /**
       * Caption Side
       * @see https://tailwindcss.com/docs/caption-side
       */
      caption: [{
        caption: ["top", "bottom"]
      }],
      // ---------------------------------
      // --- Transitions and Animation ---
      // ---------------------------------
      /**
       * Transition Property
       * @see https://tailwindcss.com/docs/transition-property
       */
      transition: [{
        transition: ["", "all", "colors", "opacity", "shadow", "transform", "none", c, l]
      }],
      /**
       * Transition Behavior
       * @see https://tailwindcss.com/docs/transition-behavior
       */
      "transition-behavior": [{
        transition: ["normal", "discrete"]
      }],
      /**
       * Transition Duration
       * @see https://tailwindcss.com/docs/transition-duration
       */
      duration: [{
        duration: [g, "initial", c, l]
      }],
      /**
       * Transition Timing Function
       * @see https://tailwindcss.com/docs/transition-timing-function
       */
      ease: [{
        ease: ["linear", "initial", j, c, l]
      }],
      /**
       * Transition Delay
       * @see https://tailwindcss.com/docs/transition-delay
       */
      delay: [{
        delay: [g, c, l]
      }],
      /**
       * Animation
       * @see https://tailwindcss.com/docs/animation
       */
      animate: [{
        animate: ["none", B, c, l]
      }],
      // ------------------
      // --- Transforms ---
      // ------------------
      /**
       * Backface Visibility
       * @see https://tailwindcss.com/docs/backface-visibility
       */
      backface: [{
        backface: ["hidden", "visible"]
      }],
      /**
       * Perspective
       * @see https://tailwindcss.com/docs/perspective
       */
      perspective: [{
        perspective: [_, c, l]
      }],
      /**
       * Perspective Origin
       * @see https://tailwindcss.com/docs/perspective-origin
       */
      "perspective-origin": [{
        "perspective-origin": G()
      }],
      /**
       * Rotate
       * @see https://tailwindcss.com/docs/rotate
       */
      rotate: [{
        rotate: $()
      }],
      /**
       * Rotate X
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-x": [{
        "rotate-x": $()
      }],
      /**
       * Rotate Y
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-y": [{
        "rotate-y": $()
      }],
      /**
       * Rotate Z
       * @see https://tailwindcss.com/docs/rotate
       */
      "rotate-z": [{
        "rotate-z": $()
      }],
      /**
       * Scale
       * @see https://tailwindcss.com/docs/scale
       */
      scale: [{
        scale: J()
      }],
      /**
       * Scale X
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-x": [{
        "scale-x": J()
      }],
      /**
       * Scale Y
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-y": [{
        "scale-y": J()
      }],
      /**
       * Scale Z
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-z": [{
        "scale-z": J()
      }],
      /**
       * Scale 3D
       * @see https://tailwindcss.com/docs/scale
       */
      "scale-3d": ["scale-3d"],
      /**
       * Skew
       * @see https://tailwindcss.com/docs/skew
       */
      skew: [{
        skew: fe()
      }],
      /**
       * Skew X
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-x": [{
        "skew-x": fe()
      }],
      /**
       * Skew Y
       * @see https://tailwindcss.com/docs/skew
       */
      "skew-y": [{
        "skew-y": fe()
      }],
      /**
       * Transform
       * @see https://tailwindcss.com/docs/transform
       */
      transform: [{
        transform: [c, l, "", "none", "gpu", "cpu"]
      }],
      /**
       * Transform Origin
       * @see https://tailwindcss.com/docs/transform-origin
       */
      "transform-origin": [{
        origin: G()
      }],
      /**
       * Transform Style
       * @see https://tailwindcss.com/docs/transform-style
       */
      "transform-style": [{
        transform: ["3d", "flat"]
      }],
      /**
       * Translate
       * @see https://tailwindcss.com/docs/translate
       */
      translate: [{
        translate: ie()
      }],
      /**
       * Translate X
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-x": [{
        "translate-x": ie()
      }],
      /**
       * Translate Y
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-y": [{
        "translate-y": ie()
      }],
      /**
       * Translate Z
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-z": [{
        "translate-z": ie()
      }],
      /**
       * Translate None
       * @see https://tailwindcss.com/docs/translate
       */
      "translate-none": ["translate-none"],
      // ---------------------
      // --- Interactivity ---
      // ---------------------
      /**
       * Accent Color
       * @see https://tailwindcss.com/docs/accent-color
       */
      accent: [{
        accent: m()
      }],
      /**
       * Appearance
       * @see https://tailwindcss.com/docs/appearance
       */
      appearance: [{
        appearance: ["none", "auto"]
      }],
      /**
       * Caret Color
       * @see https://tailwindcss.com/docs/just-in-time-mode#caret-color-utilities
       */
      "caret-color": [{
        caret: m()
      }],
      /**
       * Color Scheme
       * @see https://tailwindcss.com/docs/color-scheme
       */
      "color-scheme": [{
        scheme: ["normal", "dark", "light", "light-dark", "only-dark", "only-light"]
      }],
      /**
       * Cursor
       * @see https://tailwindcss.com/docs/cursor
       */
      cursor: [{
        cursor: ["auto", "default", "pointer", "wait", "text", "move", "help", "not-allowed", "none", "context-menu", "progress", "cell", "crosshair", "vertical-text", "alias", "copy", "no-drop", "grab", "grabbing", "all-scroll", "col-resize", "row-resize", "n-resize", "e-resize", "s-resize", "w-resize", "ne-resize", "nw-resize", "se-resize", "sw-resize", "ew-resize", "ns-resize", "nesw-resize", "nwse-resize", "zoom-in", "zoom-out", c, l]
      }],
      /**
       * Field Sizing
       * @see https://tailwindcss.com/docs/field-sizing
       */
      "field-sizing": [{
        "field-sizing": ["fixed", "content"]
      }],
      /**
       * Pointer Events
       * @see https://tailwindcss.com/docs/pointer-events
       */
      "pointer-events": [{
        "pointer-events": ["auto", "none"]
      }],
      /**
       * Resize
       * @see https://tailwindcss.com/docs/resize
       */
      resize: [{
        resize: ["none", "", "y", "x"]
      }],
      /**
       * Scroll Behavior
       * @see https://tailwindcss.com/docs/scroll-behavior
       */
      "scroll-behavior": [{
        scroll: ["auto", "smooth"]
      }],
      /**
       * Scroll Margin
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-m": [{
        "scroll-m": p()
      }],
      /**
       * Scroll Margin X
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mx": [{
        "scroll-mx": p()
      }],
      /**
       * Scroll Margin Y
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-my": [{
        "scroll-my": p()
      }],
      /**
       * Scroll Margin Start
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ms": [{
        "scroll-ms": p()
      }],
      /**
       * Scroll Margin End
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-me": [{
        "scroll-me": p()
      }],
      /**
       * Scroll Margin Top
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mt": [{
        "scroll-mt": p()
      }],
      /**
       * Scroll Margin Right
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mr": [{
        "scroll-mr": p()
      }],
      /**
       * Scroll Margin Bottom
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-mb": [{
        "scroll-mb": p()
      }],
      /**
       * Scroll Margin Left
       * @see https://tailwindcss.com/docs/scroll-margin
       */
      "scroll-ml": [{
        "scroll-ml": p()
      }],
      /**
       * Scroll Padding
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-p": [{
        "scroll-p": p()
      }],
      /**
       * Scroll Padding X
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-px": [{
        "scroll-px": p()
      }],
      /**
       * Scroll Padding Y
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-py": [{
        "scroll-py": p()
      }],
      /**
       * Scroll Padding Start
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-ps": [{
        "scroll-ps": p()
      }],
      /**
       * Scroll Padding End
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pe": [{
        "scroll-pe": p()
      }],
      /**
       * Scroll Padding Top
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pt": [{
        "scroll-pt": p()
      }],
      /**
       * Scroll Padding Right
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pr": [{
        "scroll-pr": p()
      }],
      /**
       * Scroll Padding Bottom
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pb": [{
        "scroll-pb": p()
      }],
      /**
       * Scroll Padding Left
       * @see https://tailwindcss.com/docs/scroll-padding
       */
      "scroll-pl": [{
        "scroll-pl": p()
      }],
      /**
       * Scroll Snap Align
       * @see https://tailwindcss.com/docs/scroll-snap-align
       */
      "snap-align": [{
        snap: ["start", "end", "center", "align-none"]
      }],
      /**
       * Scroll Snap Stop
       * @see https://tailwindcss.com/docs/scroll-snap-stop
       */
      "snap-stop": [{
        snap: ["normal", "always"]
      }],
      /**
       * Scroll Snap Type
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-type": [{
        snap: ["none", "x", "y", "both"]
      }],
      /**
       * Scroll Snap Type Strictness
       * @see https://tailwindcss.com/docs/scroll-snap-type
       */
      "snap-strictness": [{
        snap: ["mandatory", "proximity"]
      }],
      /**
       * Touch Action
       * @see https://tailwindcss.com/docs/touch-action
       */
      touch: [{
        touch: ["auto", "none", "manipulation"]
      }],
      /**
       * Touch Action X
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-x": [{
        "touch-pan": ["x", "left", "right"]
      }],
      /**
       * Touch Action Y
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-y": [{
        "touch-pan": ["y", "up", "down"]
      }],
      /**
       * Touch Action Pinch Zoom
       * @see https://tailwindcss.com/docs/touch-action
       */
      "touch-pz": ["touch-pinch-zoom"],
      /**
       * User Select
       * @see https://tailwindcss.com/docs/user-select
       */
      select: [{
        select: ["none", "text", "all", "auto"]
      }],
      /**
       * Will Change
       * @see https://tailwindcss.com/docs/will-change
       */
      "will-change": [{
        "will-change": ["auto", "scroll", "contents", "transform", c, l]
      }],
      // -----------
      // --- SVG ---
      // -----------
      /**
       * Fill
       * @see https://tailwindcss.com/docs/fill
       */
      fill: [{
        fill: ["none", ...m()]
      }],
      /**
       * Stroke Width
       * @see https://tailwindcss.com/docs/stroke-width
       */
      "stroke-w": [{
        stroke: [g, ne, U, be]
      }],
      /**
       * Stroke
       * @see https://tailwindcss.com/docs/stroke
       */
      stroke: [{
        stroke: ["none", ...m()]
      }],
      // ---------------------
      // --- Accessibility ---
      // ---------------------
      /**
       * Forced Color Adjust
       * @see https://tailwindcss.com/docs/forced-color-adjust
       */
      "forced-color-adjust": [{
        "forced-color-adjust": ["auto", "none"]
      }]
    },
    conflictingClassGroups: {
      overflow: ["overflow-x", "overflow-y"],
      overscroll: ["overscroll-x", "overscroll-y"],
      inset: ["inset-x", "inset-y", "start", "end", "top", "right", "bottom", "left"],
      "inset-x": ["right", "left"],
      "inset-y": ["top", "bottom"],
      flex: ["basis", "grow", "shrink"],
      gap: ["gap-x", "gap-y"],
      p: ["px", "py", "ps", "pe", "pt", "pr", "pb", "pl"],
      px: ["pr", "pl"],
      py: ["pt", "pb"],
      m: ["mx", "my", "ms", "me", "mt", "mr", "mb", "ml"],
      mx: ["mr", "ml"],
      my: ["mt", "mb"],
      size: ["w", "h"],
      "font-size": ["leading"],
      "fvn-normal": ["fvn-ordinal", "fvn-slashed-zero", "fvn-figure", "fvn-spacing", "fvn-fraction"],
      "fvn-ordinal": ["fvn-normal"],
      "fvn-slashed-zero": ["fvn-normal"],
      "fvn-figure": ["fvn-normal"],
      "fvn-spacing": ["fvn-normal"],
      "fvn-fraction": ["fvn-normal"],
      "line-clamp": ["display", "overflow"],
      rounded: ["rounded-s", "rounded-e", "rounded-t", "rounded-r", "rounded-b", "rounded-l", "rounded-ss", "rounded-se", "rounded-ee", "rounded-es", "rounded-tl", "rounded-tr", "rounded-br", "rounded-bl"],
      "rounded-s": ["rounded-ss", "rounded-es"],
      "rounded-e": ["rounded-se", "rounded-ee"],
      "rounded-t": ["rounded-tl", "rounded-tr"],
      "rounded-r": ["rounded-tr", "rounded-br"],
      "rounded-b": ["rounded-br", "rounded-bl"],
      "rounded-l": ["rounded-tl", "rounded-bl"],
      "border-spacing": ["border-spacing-x", "border-spacing-y"],
      "border-w": ["border-w-x", "border-w-y", "border-w-s", "border-w-e", "border-w-t", "border-w-r", "border-w-b", "border-w-l"],
      "border-w-x": ["border-w-r", "border-w-l"],
      "border-w-y": ["border-w-t", "border-w-b"],
      "border-color": ["border-color-x", "border-color-y", "border-color-s", "border-color-e", "border-color-t", "border-color-r", "border-color-b", "border-color-l"],
      "border-color-x": ["border-color-r", "border-color-l"],
      "border-color-y": ["border-color-t", "border-color-b"],
      translate: ["translate-x", "translate-y", "translate-none"],
      "translate-none": ["translate", "translate-x", "translate-y", "translate-z"],
      "scroll-m": ["scroll-mx", "scroll-my", "scroll-ms", "scroll-me", "scroll-mt", "scroll-mr", "scroll-mb", "scroll-ml"],
      "scroll-mx": ["scroll-mr", "scroll-ml"],
      "scroll-my": ["scroll-mt", "scroll-mb"],
      "scroll-p": ["scroll-px", "scroll-py", "scroll-ps", "scroll-pe", "scroll-pt", "scroll-pr", "scroll-pb", "scroll-pl"],
      "scroll-px": ["scroll-pr", "scroll-pl"],
      "scroll-py": ["scroll-pt", "scroll-pb"],
      touch: ["touch-x", "touch-y", "touch-pz"],
      "touch-x": ["touch"],
      "touch-y": ["touch"],
      "touch-pz": ["touch"]
    },
    conflictingClassGroupModifiers: {
      "font-size": ["leading"]
    },
    orderSensitiveModifiers: ["*", "**", "after", "backdrop", "before", "details-content", "file", "first-letter", "first-line", "marker", "placeholder", "selection"]
  };
}, qr = /* @__PURE__ */ Sr(Br);
function Jr(...e) {
  return qr(Oe(e));
}
const Xr = sr(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    defaultVariants: {
      size: "default",
      variant: "default"
    },
    variants: {
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        icon: "size-9",
        "icon-lg": "size-10",
        "icon-sm": "size-8",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5"
      },
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        ghost: "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
        outline: "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80"
      }
    }
  }
);
function Zr({
  className: e,
  variant: o = "default",
  size: r = "default",
  asChild: t = !1,
  ...s
}) {
  const a = t ? Ke : "button";
  return /* @__PURE__ */ ge.jsx(
    a,
    {
      "data-slot": "button",
      "data-variant": o,
      "data-size": r,
      className: Jr(Xr({ className: e, size: r, variant: o })),
      ...s
    }
  );
}
export {
  Zr as Button,
  Xr as buttonVariants
};
//# sourceMappingURL=index.js.map
