import fs from "node:fs/promises";
import path from "node:path";

export const DEFAULT_CHECKPOINTS = [0, 0.25, 0.5, 0.75, 1];

const STATE_NAME = "__POWERCOACH_ANIMATION_INSPECTION__";
const TRIGGER_STATE_NAME = "__POWERCOACH_ANIMATION_INSPECTION_TRIGGERED__";

function round(value, precision = 3) {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
}

function escapeTable(value) {
  return String(value ?? "").replaceAll("|", "\\|").replaceAll("\n", " ");
}

function formatRect(rect) {
  if (!rect) return "unavailable";
  return `${round(rect.left)}, ${round(rect.top)}, ${round(rect.width)} x ${round(rect.height)}`;
}

function formatBorder(style) {
  if (!style) return "";
  const widths = [
    style.borderTopWidth,
    style.borderRightWidth,
    style.borderBottomWidth,
    style.borderLeftWidth
  ].join(" / ");
  const colors = [
    style.borderTopColor,
    style.borderRightColor,
    style.borderBottomColor,
    style.borderLeftColor
  ].join(" / ");
  return `${widths}; ${colors}`;
}

function formatOutline(style) {
  if (!style) return "";
  return `${style.outlineWidth} ${style.outlineStyle} ${style.outlineColor}; offset ${style.outlineOffset}`;
}

export function maxRectDelta(frames, key = "rootRect") {
  const rects = frames.map((frame) => frame[key]).filter(Boolean);
  if (rects.length < 2) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  const first = rects[0];
  return rects.reduce(
    (result, rect) => ({
      x: Math.max(result.x, Math.abs(rect.x - first.x)),
      y: Math.max(result.y, Math.abs(rect.y - first.y)),
      width: Math.max(result.width, Math.abs(rect.width - first.width)),
      height: Math.max(result.height, Math.abs(rect.height - first.height))
    }),
    { x: 0, y: 0, width: 0, height: 0 }
  );
}

export function animationTargetLayoutDeltas(frames) {
  const candidateIndexes = [
    ...new Set(
      frames.flatMap((frame) =>
        frame.animations.map((animation) => animation.candidateIndex)
      )
    )
  ];

  return Object.fromEntries(
    candidateIndexes.map((candidateIndex) => {
      const targetFrames = frames
        .map((frame) => ({
          rect: frame.animations.find(
            (animation) => animation.candidateIndex === candidateIndex
          )?.rect
        }))
        .filter((frame) => frame.rect);
      return [candidateIndex, maxRectDelta(targetFrames, "rect")];
    })
  );
}

export function assertAnimationInspectionReady({
  discovery,
  timeline,
  live
}) {
  if (!discovery?.candidates?.length) {
    throw new Error("No finite animation candidate was discovered");
  }
  if (!timeline?.candidateSignatures?.length) {
    throw new Error("No animation candidate was selected");
  }
  if (timeline.candidateSignatures.length !== timeline.frames?.[0]?.animations?.length) {
    throw new Error("Selected animation candidates are incomplete in the timeline");
  }
  if (live?.status !== "finished") {
    throw new Error(
      `Live animation inspection did not finish: ${live?.status ?? "missing"}`
    );
  }
  if (live.animationCount !== timeline.candidateSignatures.length) {
    throw new Error("Live animation candidate count does not match the timeline");
  }
}

export async function evaluateByValue(cdp, expression) {
  const result = await cdp.send("Runtime.evaluate", {
    expression,
    returnByValue: true,
    awaitPromise: true
  });

  if (result.exceptionDetails) {
    throw new Error(result.exceptionDetails.text || "Runtime.evaluate failed");
  }

  return result.result?.value;
}

export async function prepareChromeCdp(
  tab,
  {
    width = 1440,
    height = 900,
    deviceScaleFactor = 1,
    mobile = false
  } = {}
) {
  const cdp = await tab.capabilities.get("cdp");
  await cdp.send("Page.enable", {});
  await cdp.send("Runtime.enable", {});
  await cdp.send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor,
    mobile
  });

  const viewport = await evaluateByValue(cdp, `(() => ({
    href: location.href,
    title: document.title,
    readyState: document.readyState,
    innerWidth,
    innerHeight,
    devicePixelRatio
  }))()`);

  return { cdp, viewport };
}

export async function prepareAnimationInspectionTarget(
  tab,
  {
    rootSelector,
    width = 1440,
    height = 900
  } = {}
) {
  if (!tab) throw new Error("prepareAnimationInspectionTarget requires tab");
  if (!rootSelector) {
    throw new Error("prepareAnimationInspectionTarget requires rootSelector");
  }

  const prepared = await prepareChromeCdp(tab, { width, height });
  const root = await evaluateByValue(prepared.cdp, `(() => {
    const element = document.querySelector(${JSON.stringify(rootSelector)});
    if (!element) throw new Error("Animation inspection root not found");
    const rect = element.getBoundingClientRect();
    return {
      rect: {
        x: rect.x,
        y: rect.y,
        left: rect.left,
        top: rect.top,
        right: rect.right,
        bottom: rect.bottom,
        width: rect.width,
        height: rect.height
      },
      tagName: element.tagName.toLowerCase(),
      id: element.id,
      className: typeof element.className === "string" ? element.className : "",
      dataMotion: element.getAttribute("data-motion")
    };
  })()`);

  return {
    ...prepared,
    tab,
    root,
    rootSelector
  };
}

async function captureScreenshot(cdp, { file }) {
  const result = await cdp.send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
    captureBeyondViewport: false
  });
  await fs.writeFile(file, Buffer.from(result.data, "base64"));
  return file;
}

export async function captureAnimationPreFrame(
  prepared,
  {
    outDir
  }
) {
  if (!outDir) throw new Error("captureAnimationPreFrame requires outDir");
  await fs.mkdir(outDir, { recursive: true });
  const file = path.join(outDir, "00-pre.png");
  await captureScreenshot(prepared.cdp, {
    file
  });
  const rootRect = await evaluateByValue(prepared.cdp, `(() => {
    const element = document.querySelector(${JSON.stringify(prepared.rootSelector)});
    if (!element) throw new Error("Animation inspection root not found");
    const rect = element.getBoundingClientRect();
    return {
      x: rect.x,
      y: rect.y,
      left: rect.left,
      top: rect.top,
      right: rect.right,
      bottom: rect.bottom,
      width: rect.width,
      height: rect.height
    };
  })()`);
  return { file, rootRect };
}

export async function discoverAnimationInspection(
  prepared,
  {
    trigger,
    timeoutMs = 2000,
    pollMs = 16
  } = {}
) {
  if (typeof trigger !== "function") {
    throw new Error("discoverAnimationInspection requires trigger");
  }

  await evaluateByValue(
    prepared.cdp,
    `window[${JSON.stringify(TRIGGER_STATE_NAME)}] = false`
  );

  const discoveryPromise = evaluateByValue(prepared.cdp, `(async () => {
    const root = document.querySelector(${JSON.stringify(prepared.rootSelector)});
    if (!root) throw new Error("Animation inspection root not found");
    const animations = [];
    const seenAnimations = new Set();

    while (!window[${JSON.stringify(TRIGGER_STATE_NAME)}]) {
      await new Promise((resolve) => setTimeout(resolve, ${Number(pollMs)}));
    }

    const deadline = performance.now() + ${Number(timeoutMs)};
    while (performance.now() < deadline) {
      for (const animation of root.getAnimations({ subtree: true })) {
        if (seenAnimations.has(animation)) continue;
        seenAnimations.add(animation);
        const target = animation.effect?.target ?? null;
        const targetId = target?.id || null;
        const dataMotion = target?.getAttribute?.("data-motion") ?? null;
        animations.push({
          animation,
          identity: {
            targetKey: targetId
              ? \`id:\${targetId}\`
              : dataMotion
                ? \`data-motion:\${dataMotion}:\${target?.tagName?.toLowerCase?.() ?? "unknown"}\`
                : \`path:\${targetPath(target)}\`,
            targetId,
            dataMotion
          }
        });
      }
      await new Promise((resolve) => setTimeout(resolve, ${Number(pollMs)}));
    }

    const finite = [];
    const infinite = [];
    const finiteSignatureCounts = new Map();
    const infiniteSignatureCounts = new Map();

    function targetPath(target) {
      if (!target || target === root) return ":scope";
      const parts = [];
      let current = target;
      while (current && current !== root) {
        const parent = current.parentElement;
        if (!parent) break;
        const index = Array.from(parent.children).indexOf(current) + 1;
        parts.unshift(\`\${current.tagName.toLowerCase()}:nth-child(\${index})\`);
        current = parent;
      }
      return current === root ? \`:scope > \${parts.join(" > ")}\` : null;
    }

    function signatureOf(identity, properties, signatureCounts) {
      const base = JSON.stringify({
        ...identity,
        properties: [...properties].sort()
      });
      const occurrence = signatureCounts.get(base) ?? 0;
      signatureCounts.set(base, occurrence + 1);
      return \`\${base}#\${occurrence}\`;
    }

    for (const item of animations) {
      const { animation, identity } = item;
      const timing = animation.effect?.getComputedTiming?.() ?? {};
      const target = animation.effect?.target ?? null;
      const activeDuration = Number(timing.activeDuration);
      const isFiniteAnimation =
        Number.isFinite(activeDuration) && activeDuration > 0;
      const properties = animation.effect?.getKeyframes?.()
        ?.flatMap((frame) => Object.keys(frame))
        .filter((key, index, values) =>
          !["offset", "easing", "composite", "computedOffset"].includes(key)
          && values.indexOf(key) === index
        )?.sort() ?? [];
      const descriptor = {
        index: -1,
        signature: signatureOf(
          identity,
          properties,
          isFiniteAnimation ? finiteSignatureCounts : infiniteSignatureCounts
        ),
        playState: animation.playState,
        startTime: animation.startTime,
        currentTime: animation.currentTime,
        activeDuration: Number.isFinite(activeDuration) ? activeDuration : null,
        delay: Number(timing.delay) || 0,
        endDelay: Number(timing.endDelay) || 0,
        iterations: timing.iterations,
        direction: timing.direction,
        easing: timing.easing,
        fill: timing.fill,
        target: target ? {
          tagName: target.tagName?.toLowerCase?.() ?? null,
          id: identity.targetId || "",
          className: typeof target.className === "string" ? target.className : "",
          dataMotion: identity.dataMotion
        } : null,
        properties
      };

      if (isFiniteAnimation) {
        descriptor.index = finite.length;
        animation.pause();
        finite.push({ animation, descriptor });
      } else {
        infinite.push(descriptor);
      }
    }

    window[${JSON.stringify(STATE_NAME)}] = {
      animations: finite.map((item) => ({
        animation: item.animation,
        index: item.descriptor.index,
        signature: item.descriptor.signature
      })),
      root
    };

    return {
      candidates: finite.map((item) => item.descriptor),
      infinite,
      total: animations.length
    };
  })()`);

  await new Promise((resolve) => setTimeout(resolve, 0));
  await evaluateByValue(
    prepared.cdp,
    `window[${JSON.stringify(TRIGGER_STATE_NAME)}] = true`
  );
  await trigger();
  const discovery = await discoveryPromise;

  if (discovery.candidates.length === 0) {
    throw new Error(
      discovery.infinite.length > 0
        ? "Only infinite animations were exposed by the target"
        : "No browser-exposed animation was found under the target"
    );
  }

  return discovery;
}

export async function captureAnimationInspectionTimeline(
  prepared,
  {
    outDir,
    candidateSignatures,
    checkpoints = DEFAULT_CHECKPOINTS
  }
) {
  if (!outDir) {
    throw new Error("captureAnimationInspectionTimeline requires outDir");
  }
  if (!Array.isArray(candidateSignatures) || candidateSignatures.length === 0) {
    throw new Error(
      "captureAnimationInspectionTimeline requires selected candidateSignatures"
    );
  }
  await fs.mkdir(outDir, { recursive: true });
  const frames = [];

  for (let index = 0; index < checkpoints.length; index += 1) {
    const progress = checkpoints[index];
    const sample = await evaluateByValue(prepared.cdp, `(async () => {
      const state = window[${JSON.stringify(STATE_NAME)}];
      if (!state) throw new Error("Animation inspection state is unavailable");
      const requested = ${JSON.stringify(candidateSignatures)};
      const selected = requested
        .map((signature) =>
          state.animations.find((item) => item.signature === signature)
        )
        .filter(Boolean);
      if (selected.length !== requested.length) {
        throw new Error("A selected animation candidate is unavailable");
      }

      for (const { animation } of selected) {
        const timing = animation.effect?.getComputedTiming?.() ?? {};
        const delay = Number(timing.delay) || 0;
        const activeDuration = Number(timing.activeDuration);
        if (!Number.isFinite(activeDuration)) continue;
        animation.pause();
        animation.currentTime = delay + activeDuration * ${Number(progress)};
      }

      await new Promise((resolve) => requestAnimationFrame(() =>
        requestAnimationFrame(resolve)
      ));

      function rectOf(element) {
        const rect = element.getBoundingClientRect();
        return {
          x: rect.x,
          y: rect.y,
          left: rect.left,
          top: rect.top,
          right: rect.right,
          bottom: rect.bottom,
          width: rect.width,
          height: rect.height
        };
      }

      function styleOf(element) {
        const style = getComputedStyle(element);
        return {
          opacity: style.opacity,
          transform: style.transform,
          clipPath: style.clipPath,
          overflow: style.overflow,
          overflowX: style.overflowX,
          overflowY: style.overflowY,
          visibility: style.visibility,
          display: style.display,
          position: style.position,
          zIndex: style.zIndex,
          filter: style.filter,
          backgroundColor: style.backgroundColor,
          color: style.color,
          borderTopColor: style.borderTopColor,
          borderRightColor: style.borderRightColor,
          borderBottomColor: style.borderBottomColor,
          borderLeftColor: style.borderLeftColor,
          borderTopStyle: style.borderTopStyle,
          borderRightStyle: style.borderRightStyle,
          borderBottomStyle: style.borderBottomStyle,
          borderLeftStyle: style.borderLeftStyle,
          borderTopWidth: style.borderTopWidth,
          borderRightWidth: style.borderRightWidth,
          borderBottomWidth: style.borderBottomWidth,
          borderLeftWidth: style.borderLeftWidth,
          outlineColor: style.outlineColor,
          outlineOffset: style.outlineOffset,
          outlineStyle: style.outlineStyle,
          outlineWidth: style.outlineWidth,
          width: style.width,
          height: style.height
        };
      }

      function clippingAncestorsOf(element) {
        const ancestors = [];
        let current = element.parentElement;
        while (current && ancestors.length < 12) {
          const style = getComputedStyle(current);
          if (
            style.overflow !== "visible"
            || style.overflowX !== "visible"
            || style.overflowY !== "visible"
          ) {
            ancestors.push({
              tagName: current.tagName.toLowerCase(),
              id: current.id || "",
              overflow: style.overflow,
              overflowX: style.overflowX,
              overflowY: style.overflowY,
              rect: rectOf(current)
            });
          }
          current = current.parentElement;
        }
        return ancestors;
      }

      return {
        progress: ${Number(progress)},
        rootRect: rectOf(state.root),
        rootStyle: styleOf(state.root),
        animations: selected.map(({ index: candidateIndex, animation }) => {
          const target = animation.effect?.target ?? state.root;
          return {
            candidateIndex,
            currentTime: animation.currentTime,
            playState: animation.playState,
            rect: rectOf(target),
            style: styleOf(target),
            clippingAncestors: clippingAncestorsOf(target)
          };
        })
      };
    })()`);

    const percent = String(Math.round(progress * 100)).padStart(3, "0");
    const file = path.join(
      outDir,
      `${String(index + 1).padStart(2, "0")}-${percent}pct.png`
    );
    await captureScreenshot(prepared.cdp, {
      file
    });
    frames.push({ ...sample, file });
  }

  return {
    candidateSignatures,
    checkpoints,
    frames,
    layoutDelta: maxRectDelta(frames),
    targetLayoutDeltas: animationTargetLayoutDeltas(frames)
  };
}

export async function cleanupAnimationInspection(
  prepared,
  {
    cancel = true
  } = {}
) {
  return await evaluateByValue(prepared.cdp, `(() => {
    const state = window[${JSON.stringify(STATE_NAME)}];
    if (!state) {
      delete window[${JSON.stringify(TRIGGER_STATE_NAME)}];
      return { cleaned: false };
    }
    for (const { animation } of state.animations ?? []) {
      try {
        if (${Boolean(cancel)}) animation.cancel();
        else animation.play();
      } catch {}
    }
    delete window[${JSON.stringify(STATE_NAME)}];
    delete window[${JSON.stringify(TRIGGER_STATE_NAME)}];
    return { cleaned: true };
  })()`);
}

export async function measureLiveAnimationInspection(
  prepared,
  {
    reset,
    trigger,
    candidateSignatures,
    timeoutMs = 10000,
    pollMs = 16
  }
) {
  if (typeof trigger !== "function") {
    throw new Error("measureLiveAnimationInspection requires trigger");
  }
  if (!Array.isArray(candidateSignatures) || candidateSignatures.length === 0) {
    throw new Error(
      "measureLiveAnimationInspection requires selected candidateSignatures"
    );
  }

  await cleanupAnimationInspection(prepared).catch(() => {});
  if (typeof reset === "function") await reset();
  await evaluateByValue(
    prepared.cdp,
    `window[${JSON.stringify(TRIGGER_STATE_NAME)}] = false`
  );

  const resultPromise = evaluateByValue(prepared.cdp, `(async () => {
    const root = document.querySelector(${JSON.stringify(prepared.rootSelector)});
    if (!root) throw new Error("Animation inspection root not found");
    while (!window[${JSON.stringify(TRIGGER_STATE_NAME)}]) {
      await new Promise((resolve) => setTimeout(resolve, ${Number(pollMs)}));
    }

    const startedAt = performance.now();
    const deadline = startedAt + ${Number(timeoutMs)};
    const requested = ${JSON.stringify(candidateSignatures)};
    const seenAnimations = new Set();
    const signatureCounts = new Map();
    const matchedAnimations = new Map();

    function targetPath(target) {
      if (!target || target === root) return ":scope";
      const parts = [];
      let current = target;
      while (current && current !== root) {
        const parent = current.parentElement;
        if (!parent) break;
        const index = Array.from(parent.children).indexOf(current) + 1;
        parts.unshift(\`\${current.tagName.toLowerCase()}:nth-child(\${index})\`);
        current = parent;
      }
      return current === root ? \`:scope > \${parts.join(" > ")}\` : null;
    }

    while (performance.now() < deadline) {
      for (const animation of root.getAnimations({ subtree: true })) {
        if (seenAnimations.has(animation)) continue;
        const activeDuration = Number(
          animation.effect?.getComputedTiming?.().activeDuration
        );
        if (!Number.isFinite(activeDuration) || activeDuration <= 0) continue;
        seenAnimations.add(animation);

        const target = animation.effect?.target ?? null;
        const targetId = target?.id || null;
        const dataMotion = target?.getAttribute?.("data-motion") ?? null;
        const properties = animation.effect?.getKeyframes?.()
          ?.flatMap((frame) => Object.keys(frame))
          .filter((key, index, values) =>
            !["offset", "easing", "composite", "computedOffset"].includes(key)
            && values.indexOf(key) === index
          )?.sort() ?? [];
        const base = JSON.stringify({
          targetKey: targetId
            ? \`id:\${targetId}\`
            : dataMotion
              ? \`data-motion:\${dataMotion}:\${target?.tagName?.toLowerCase?.() ?? "unknown"}\`
              : \`path:\${targetPath(target)}\`,
          targetId,
          dataMotion,
          properties
        });
        const occurrence = signatureCounts.get(base) ?? 0;
        signatureCounts.set(base, occurrence + 1);
        const signature = \`\${base}#\${occurrence}\`;
        if (requested.includes(signature)) {
          matchedAnimations.set(signature, animation);
        }
      }
      if (matchedAnimations.size === requested.length) break;
      await new Promise((resolve) => setTimeout(resolve, ${Number(pollMs)}));
    }

    const animations = requested
      .map((signature) => matchedAnimations.get(signature))
      .filter(Boolean);

    if (animations.length !== requested.length) {
      return {
        status: "missing",
        animationCount: animations.length,
        expectedAnimationCount: requested.length,
        elapsedMs: performance.now() - startedAt
      };
    }

    const durations = animations.map((animation) => {
      const timing = animation.effect?.getComputedTiming?.() ?? {};
      return Number(timing.activeDuration);
    });

    const finished = Promise.allSettled(
      animations.map((animation) => animation.finished)
    );
    const timeout = new Promise((resolve) =>
      setTimeout(() => resolve("timeout"), ${Number(timeoutMs)})
    );
    const completion = await Promise.race([finished, timeout]);

    if (completion === "timeout") {
      return {
        status: "timeout",
        animationCount: animations.length,
        durations,
        elapsedMs: performance.now() - startedAt
      };
    }

    const fulfilledCount = completion.filter(
      (item) => item.status === "fulfilled"
    ).length;
    const rejectedCount = completion.length - fulfilledCount;

    return {
      status: rejectedCount > 0 ? "cancelled" : "finished",
      animationCount: animations.length,
      fulfilledCount,
      rejectedCount,
      durations,
      elapsedMs: performance.now() - startedAt
    };
  })()`);

  await new Promise((resolve) => setTimeout(resolve, 0));
  const triggerAt = Date.now();
  await evaluateByValue(
    prepared.cdp,
    `window[${JSON.stringify(TRIGGER_STATE_NAME)}] = true`
  );
  await trigger();
  const result = await resultPromise;

  return {
    ...result,
    triggerAt
  };
}

export function createAnimationInspectionReportData({
  prepared,
  pre,
  discovery,
  timeline,
  live,
  target,
  trigger,
  observations = [],
  limitations = []
}) {
  assertAnimationInspectionReady({ discovery, timeline, live });

  const infiniteLimitations = discovery.infinite.map((animation) =>
    `Infinite animation on ${animation.target?.tagName ?? "unknown target"}`
  );

  return {
    browser: "@chrome / $chrome:control-chrome",
    url: prepared.viewport.href,
    viewport: prepared.viewport,
    target,
    trigger,
    pre,
    candidates: timeline.candidateSignatures
      .map((signature) =>
        discovery.candidates.find((candidate) => candidate.signature === signature)
      )
      .filter(Boolean),
    infiniteAnimations: discovery.infinite,
    frames: timeline.frames,
    layoutDelta: timeline.layoutDelta,
    targetLayoutDeltas: timeline.targetLayoutDeltas,
    live,
    observations,
    limitations: [...infiniteLimitations, ...limitations]
  };
}

export function buildAnimationInspectionMarkdown(report) {
  const frameRows = report.frames
    .flatMap((frame) =>
      frame.animations.map((animation, index) => {
        const image = index === 0
          ? `![${Math.round(frame.progress * 100)}%](./${path.basename(frame.file)})`
          : "";
        return `| ${Math.round(frame.progress * 100)}% | ${animation.candidateIndex} | ${formatRect(animation.rect)} | ${escapeTable(animation.style?.opacity)} | ${escapeTable(animation.style?.clipPath)} | ${escapeTable(animation.style?.overflow)} | ${animation.clippingAncestors?.length ?? 0} | ${escapeTable(animation.style?.transform)} | ${escapeTable(animation.style?.backgroundColor)} | ${escapeTable(animation.style?.color)} | ${escapeTable(formatBorder(animation.style))} | ${escapeTable(formatOutline(animation.style))} | ${escapeTable(animation.style?.width)} | ${escapeTable(animation.style?.height)} | ${image} |`;
      })
    )
    .join("\n");
  const candidateRows = report.candidates
    .map((candidate) =>
      `| ${candidate.index} | ${escapeTable(candidate.target?.tagName)} | ${escapeTable(candidate.target?.dataMotion)} | ${escapeTable(candidate.properties.join(", "))} | ${escapeTable(candidate.delay)} | ${escapeTable(candidate.activeDuration)} | ${escapeTable(candidate.endDelay)} | ${escapeTable(candidate.iterations)} | ${escapeTable(candidate.easing)} |`
    )
    .join("\n");
  const observations = report.observations.length
    ? report.observations.map((item) => `- ${item}`).join("\n")
    : "- None recorded.";
  const limitations = report.limitations.length
    ? report.limitations.map((item) => `- ${item}`).join("\n")
    : "- None.";
  const targetLayoutDeltas = Object.entries(report.targetLayoutDeltas ?? {})
    .map(([candidate, delta]) =>
      `candidate ${candidate}: x ${round(delta.x)}, y ${round(delta.y)}, width ${round(delta.width)}, height ${round(delta.height)}`
    )
    .join("; ") || "none";

  return `# Animation Inspection

- Browser: ${report.browser}
- URL: ${report.url}
- Target: ${report.target}
- Trigger: ${report.trigger}
- Viewport: ${report.viewport.innerWidth} x ${report.viewport.innerHeight}
- Live status: ${report.live.status}
- Live elapsed: ${round(report.live.elapsedMs)} ms
- Layout delta: x ${round(report.layoutDelta.x)}, y ${round(report.layoutDelta.y)}, width ${round(report.layoutDelta.width)}, height ${round(report.layoutDelta.height)}
- Target layout deltas: ${targetLayoutDeltas}

## Candidates

| Index | Host | data-motion | Properties | Delay | Active duration | End delay | Iterations | Easing |
|---:|---|---|---|---:|---:|---:|---:|---|
${candidateRows}

## Timeline

![Pre-interaction](./${path.basename(report.pre.file)})

| Progress | Candidate | Rectangle | Opacity | clip-path | Overflow | Clipping ancestors | Transform | Background | Color | Border | Outline | Width | Height | Frame |
|---:|---:|---|---|---|---|---:|---|---|---|---|---|---|---|---|
${frameRows}

## Observations

${observations}

## Limitations

${limitations}
`;
}

export async function writeAnimationInspectionReport({
  outDir,
  report
}) {
  if (!outDir) throw new Error("writeAnimationInspectionReport requires outDir");
  if (!report) throw new Error("writeAnimationInspectionReport requires report");
  await fs.mkdir(outDir, { recursive: true });
  const file = path.join(outDir, "report.md");
  await fs.writeFile(file, buildAnimationInspectionMarkdown(report), "utf8");
  return file;
}
