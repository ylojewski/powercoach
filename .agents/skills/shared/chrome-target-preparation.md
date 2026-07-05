# Chrome Target Preparation

Use the blocker shape from [powercoach-ui-contract.md](powercoach-ui-contract.md).

Prepare one new controlled tab in the user's real Chrome:

1. Read and follow `$chrome:control-chrome` completely.
2. Use its current plugin root and runtime bootstrap; never hardcode a cached plugin path.
3. Select the extension browser and emit its complete documentation exactly as that skill requires.
4. Create a new controlled tab. Never reuse an existing controlled or user-owned tab.
5. Navigate before requesting CDP.
6. Acquire the tab's `cdp` capability.
7. Enable `Page` and `Runtime`.
8. Wait for `document.readyState === "complete"` and verify the exact expected
   origin. A redirect, error document, or origin mismatch blocks preparation.
9. Leave the browser, tab, and CDP bindings available to the caller.

Do not close the tab during setup. The calling workflow owns inspection and closes the tab when its pass ends.

If setup fails, return the shared `Blocked` artifact. Do not substitute the in-app browser, standalone or headless Playwright, another browser, another server, DOM-only inspection, or source inspection.
