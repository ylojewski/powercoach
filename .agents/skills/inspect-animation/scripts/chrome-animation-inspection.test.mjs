import assert from "node:assert/strict";
import test from "node:test";

import {
  animationTargetLayoutDeltas,
  assertAnimationInspectionReady,
  buildAnimationInspectionMarkdown,
  createAnimationInspectionReportData,
  evaluateByValue,
  maxRectDelta
} from "./chrome-animation-inspection.mjs";

test("maxRectDelta reports movement and size changes from the first frame", () => {
  assert.deepEqual(
    maxRectDelta([
      { rootRect: { x: 10, y: 20, width: 100, height: 40 } },
      { rootRect: { x: 14, y: 18, width: 110, height: 35 } }
    ]),
    { x: 4, y: 2, width: 10, height: 5 }
  );
});

test("animationTargetLayoutDeltas reports each selected target independently", () => {
  assert.deepEqual(
    animationTargetLayoutDeltas([
      {
        animations: [
          {
            candidateIndex: 0,
            rect: { x: 0, y: 0, width: 100, height: 20 }
          },
          {
            candidateIndex: 1,
            rect: { x: 5, y: 5, width: 20, height: 20 }
          }
        ]
      },
      {
        animations: [
          {
            candidateIndex: 0,
            rect: { x: 10, y: 0, width: 100, height: 25 }
          },
          {
            candidateIndex: 1,
            rect: { x: 5, y: 8, width: 18, height: 20 }
          }
        ]
      }
    ]),
    {
      0: { x: 10, y: 0, width: 0, height: 5 },
      1: { x: 0, y: 3, width: 2, height: 0 }
    }
  );
});

test("assertAnimationInspectionReady accepts only complete finished evidence", () => {
  const ready = {
    discovery: { candidates: [{ signature: "candidate" }] },
    timeline: {
      candidateSignatures: ["candidate"],
      frames: [{ animations: [{ candidateIndex: 0 }] }]
    },
    live: { animationCount: 1, status: "finished" }
  };

  assert.doesNotThrow(() => assertAnimationInspectionReady(ready));
  assert.throws(
    () => assertAnimationInspectionReady({
      ...ready,
      live: { animationCount: 1, status: "cancelled" }
    }),
    /did not finish: cancelled/
  );
});

test("evaluateByValue surfaces CDP runtime exceptions", async () => {
  const cdp = {
    async send() {
      return { exceptionDetails: { text: "page failure" } };
    }
  };

  await assert.rejects(
    evaluateByValue(cdp, "broken()"),
    /page failure/
  );
});

test("report creation blocks incomplete live inspection", () => {
  assert.throws(
    () => createAnimationInspectionReportData({
      prepared: { viewport: { href: "http://localhost:6006" } },
      pre: {},
      discovery: { candidates: [{ signature: "candidate" }], infinite: [] },
      timeline: {
        candidateSignatures: ["candidate"],
        frames: [{ animations: [{ candidateIndex: 0 }] }],
        layoutDelta: {},
        targetLayoutDeltas: {}
      },
      live: { animationCount: 0, status: "missing" },
      target: "[data-motion]",
      trigger: "click"
    }),
    /did not finish: missing/
  );
});

test("the Markdown report keeps timing and computed visual evidence", () => {
  const markdown = buildAnimationInspectionMarkdown({
    browser: "Chrome",
    candidates: [
      {
        activeDuration: 200,
        delay: 10,
        easing: "ease-out",
        endDelay: 0,
        index: 0,
        iterations: 1,
        properties: ["opacity"],
        target: { dataMotion: "reveal", tagName: "div" }
      }
    ],
    frames: [
      {
        animations: [
          {
            candidateIndex: 0,
            rect: { left: 0, top: 0, width: 100, height: 20 },
            style: {
              backgroundColor: "rgb(0, 0, 0)",
              clipPath: "none",
              color: "rgb(255, 255, 255)",
              height: "20px",
              opacity: "0.5",
              transform: "none",
              width: "100px"
            }
          }
        ],
        file: "/tmp/01-000pct.png",
        progress: 0
      }
    ],
    layoutDelta: { x: 0, y: 0, width: 0, height: 0 },
    targetLayoutDeltas: {
      0: { x: 2, y: 0, width: 0, height: 0 }
    },
    limitations: [],
    live: { elapsedMs: 215, status: "finished" },
    observations: [],
    pre: { file: "/tmp/00-pre.png" },
    target: "[data-motion]",
    trigger: "click",
    url: "http://localhost:6006",
    viewport: { innerHeight: 900, innerWidth: 1440 }
  });

  assert.match(markdown, /Active duration/);
  assert.match(markdown, /ease-out/);
  assert.match(markdown, /Opacity/);
  assert.match(markdown, /0\.5/);
  assert.match(markdown, /rgb\(0, 0, 0\)/);
  assert.match(markdown, /100px/);
  assert.match(markdown, /candidate 0: x 2/);
});
