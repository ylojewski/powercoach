---
name: inspect-manager
description: Open a new controlled tab for the running Powercoach manager at http://localhost:3000 in the user's real Chrome and initialize its CDP capability for a calling inspection workflow.
---

# Inspect Manager

Prepare the manager target only; do not inspect or issue a verdict.

Read [../shared/chrome-target-preparation.md](../shared/chrome-target-preparation.md), then apply it with:

```text
Origin: http://localhost:3000
Tab binding: globalThis.managerTab
CDP binding: globalThis.managerCdp
Browser binding: globalThis.browser
```

Create the tab with:

```js
globalThis.managerTab = await browser.tabs.new()
```

After navigation, acquire CDP with:

```js
globalThis.managerCdp = await managerTab.capabilities.get("cdp")
```

Successful preparation is not completion of the caller's task. Continue with the requesting workflow.

