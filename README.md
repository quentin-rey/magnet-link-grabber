# Magnet Link Grabber

Browser extension (Chrome and Firefox) that grabs every magnet link (`magnet:?xt...`) found on a web page, so you can copy them easily.

> ⚠️ **Not yet published on the Chrome Web Store.** For now the Chrome extension can only be installed manually in developer mode — see [Installation](#installation) below.

<p align="center">
  <img src="screenshots/popup-light.png" alt="Popup in light mode" width="360" />
  <img src="screenshots/popup-dark.png" alt="Popup in dark mode" width="360" />
</p>

## Features

- Scans `<a href="magnet:?xt...">` links on the active tab
- Lists the links found in a popup, with the torrent name when available (`dn=` parameter)
- Live search filter over the link name/URL
- Per-link checkboxes with "select all" and "copy selection"
- "Copy all" button to copy every link (one per line) to the clipboard
- Individual "Copy" button for each link
- Light / dark / system theme toggle

### Search

Type a few words to filter the list — matching is order-independent, so `open bunny` finds `Blender Open Movie - Big Buck Bunny`.

<p align="center">
  <img src="screenshots/popup-search.png" alt="Filtering links with the search box" width="360" />
</p>

### Selecting links

Check the boxes you need (or "Select all") and hit "Copy selection" to copy only those links.

<p align="center">
  <img src="screenshots/popup-selection.png" alt="Selecting specific links to copy" width="360" />
</p>

## Installation

### Chrome (developer mode)

1. Open `chrome://extensions`
2. Enable "Developer mode" (top right)
3. Click "Load unpacked"
4. Select this project's folder

### Firefox

- **Permanent install:** download the signed `.xpi` from the [Releases](../../releases) page and drag it into a Firefox window (or `about:addons` → gear icon → "Install Add-on From File").
- **Temporary / dev mode:** open `about:debugging#/runtime/this-firefox` → "Load Temporary Add-on" → select `manifest.json` in this project's folder. Resets on every Firefox restart.

## Usage

1. Open a page containing magnet links
2. Click the extension icon
3. Copy the link(s) you want

## Project structure

- `manifest.json` — extension configuration (Manifest V3)
- `popup.html` / `popup.css` / `popup.js` — popup UI and logic
- `icons/` — extension icons
- `screenshots/` — images used in this README
