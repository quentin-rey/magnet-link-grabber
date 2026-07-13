# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Git workflow

- Every feature or fix gets its own branch — never commit directly to `main`.
- Committing is fine to do automatically, without asking first.
- Pushing is never automatic — always ask for explicit confirmation before running `git push`, regardless of branch.

## What this is

Magnet Link Grabber is a Manifest V3 browser extension (Chrome + Firefox) that scans the active tab for `magnet:?xt...` links and lists them in a popup for copying (individually, selected, or all). No backend, no build step — plain HTML/CSS/JS loaded directly by the browser.

## Structure

- `manifest.json` — MV3 config (permissions: `activeTab`, `scripting`, `clipboardWrite`, `storage`; includes Firefox-specific `browser_specific_settings`/`gecko` block).
- `popup.html` / `popup.css` / `popup.js` — the entire UI and logic (scanning, search/filter, selection, copy, theme toggle).
- `icons/` — extension icons at required sizes.
- `screenshots/` — images used in `README.md`.

## Working conventions

- No package manager or bundler — edit `popup.js`/`popup.html`/`popup.css` directly.
- Test changes by loading the unpacked extension: `chrome://extensions` → Developer mode → "Load unpacked", or Firefox `about:debugging#/runtime/this-firefox` → "Load Temporary Add-on" → select `manifest.json`.
- Bump `version` in `manifest.json` (and `amo-metadata.json` if relevant) when shipping a change intended for release.
- Keep `permissions` in `manifest.json` minimal — only add a new permission if the feature genuinely requires it, since AMO/Chrome Web Store review scrutinizes permission scope.
