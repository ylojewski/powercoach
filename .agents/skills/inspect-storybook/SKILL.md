---
name: inspect-storybook
description: Open a new controlled tab for the running Powercoach Storybook at http://localhost:6006 in the user's real Chrome and initialize its CDP capability for a calling inspection workflow.
---

# Inspect Storybook

Prepare the Storybook target only; do not inspect or issue a verdict.

Read [../shared/chrome-target-preparation.md](../shared/chrome-target-preparation.md), then apply it with:

```text
Origin: http://localhost:6006
Tab binding: globalThis.storybookTab
CDP binding: globalThis.storybookCdp
Browser binding: globalThis.browser
```

Create the tab with:

```js
globalThis.storybookTab = await browser.tabs.new()
```

After navigation, acquire CDP with:

```js
globalThis.storybookCdp = await storybookTab.capabilities.get("cdp")
```

Successful preparation is not completion of the caller's task. Continue with the requesting workflow.

