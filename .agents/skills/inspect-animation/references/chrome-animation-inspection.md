# Chrome Animation Inspection

Use the prepared `managerTab` or `storybookTab`. Resolve the helper relative to the skill directory.

```js
var prepared

try {
  prepared = await animationInspection.prepareAnimationInspectionTarget(tab, {
    rootSelector,
    width: viewportWidth,
    height: viewportHeight
  })

  await reset()
  var pre = await animationInspection.captureAnimationPreFrame(prepared, { outDir })

  await reset()
  var discovery = await animationInspection.discoverAnimationInspection(prepared, {
    trigger
  })

  // Inspect every candidate. selectedCandidates contains every candidate
  // belonging to the requested motion, not merely the first match.
  var candidateSignatures = selectedCandidates.map(
    (candidate) => candidate.signature
  )

  var timeline = await animationInspection.captureAnimationInspectionTimeline(
    prepared,
    { outDir, candidateSignatures }
  )

  var live = await animationInspection.measureLiveAnimationInspection(prepared, {
    reset,
    trigger,
    candidateSignatures
  })

  animationInspection.assertAnimationInspectionReady({
    discovery,
    timeline,
    live
  })

  // Inspect all screenshots before writing factual observations.
  var report = animationInspection.createAnimationInspectionReportData({
    prepared,
    pre,
    discovery,
    timeline,
    live,
    target: rootSelector,
    trigger: triggerDescription,
    observations,
    limitations
  })

  await animationInspection.writeAnimationInspectionReport({ outDir, report })
} finally {
  if (prepared) {
    await animationInspection.cleanupAnimationInspection(prepared).catch(() => {})
  }
}
```

Timeline positions are progress samples, not elapsed-time claims. Live elapsed
time is measured from the armed trigger to browser completion and includes
trigger-command latency. Report absent, cancelled, timed-out, non-seekable, or
unmatched requested animations through the shared blocker; never infer timing.
An infinite animation blocks only when it belongs to the requested motion and
has no finite candidate that can satisfy the inspection. Unrelated infinite
animations remain explicit limitations.

When the caller asks for surface, border, outline, clipping, or theme evidence,
record visible screenshot facts as observations. Computed rectangles and layout
deltas only prove geometry; they do not prove that a revealed surface visually
covers a border or excludes an outline.
