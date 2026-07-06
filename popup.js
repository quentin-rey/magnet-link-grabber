const statusEl = document.getElementById("status");
const listEl = document.getElementById("linkList");
const countEl = document.getElementById("count");
const searchInput = document.getElementById("searchInput");
const selectAllCheckbox = document.getElementById("selectAllCheckbox");
const selectAllLabel = document.getElementById("selectAllLabel");
const copyAllBtn = document.getElementById("copyAllBtn");
const copySelectedBtn = document.getElementById("copySelectedBtn");
const themeToggleBtn = document.getElementById("themeToggleBtn");

let allLinks = []; // [{ url, name }]
const selected = new Set();

const THEME_KEY = "theme";
const THEME_MODES = ["system", "light", "dark"];
const darkMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

let themeMode = "system";

function systemTheme() {
  return darkMediaQuery.matches ? "dark" : "light";
}

const THEME_LABELS = { system: "system", light: "light", dark: "dark" };

function applyThemeMode(mode) {
  themeMode = mode;
  document.documentElement.setAttribute("data-theme-mode", mode);
  document.documentElement.setAttribute("data-theme", mode === "system" ? systemTheme() : mode);
  themeToggleBtn.title = `Theme: ${THEME_LABELS[mode]}`;
}

async function initTheme() {
  const stored = await chrome.storage.local.get(THEME_KEY);
  applyThemeMode(stored[THEME_KEY] || "system");
}

darkMediaQuery.addEventListener("change", () => {
  if (themeMode === "system") applyThemeMode("system");
});

themeToggleBtn.addEventListener("click", async () => {
  const next = THEME_MODES[(THEME_MODES.indexOf(themeMode) + 1) % THEME_MODES.length];
  applyThemeMode(next);
  await chrome.storage.local.set({ [THEME_KEY]: next });
});

initTheme();

function extractMagnetLinks() {
  const anchors = Array.from(document.querySelectorAll('a[href^="magnet:?xt"]'));
  const seen = new Set();
  const links = [];
  for (const a of anchors) {
    if (!seen.has(a.href)) {
      seen.add(a.href);
      links.push(a.href);
    }
  }
  return links;
}

function displayName(magnetUrl) {
  const match = magnetUrl.match(/[?&]dn=([^&]+)/);
  if (match) {
    try {
      return decodeURIComponent(match[1].replace(/\+/g, " "));
    } catch {
      return match[1];
    }
  }
  return magnetUrl;
}

async function copyText(text, btn, activeLabel) {
  await navigator.clipboard.writeText(text);
  if (!btn) return;
  const original = btn.textContent;
  btn.textContent = activeLabel || "Copied!";
  btn.classList.add("copied");
  setTimeout(() => {
    btn.textContent = original;
    btn.classList.remove("copied");
  }, 1200);
}

function currentFilterWords() {
  return searchInput.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function matchesFilter(name, url, words) {
  if (words.length === 0) return true;
  const haystack = `${name} ${url}`;
  return words.every((word) => haystack.includes(word));
}

function visibleLinks() {
  const words = currentFilterWords();
  if (words.length === 0) return allLinks;
  return allLinks.filter((l) => matchesFilter(l.name.toLowerCase(), l.url.toLowerCase(), words));
}

function updateSelectAllState() {
  const visible = visibleLinks();
  const visibleSelectedCount = visible.filter((l) => selected.has(l.url)).length;

  if (visible.length === 0) {
    selectAllCheckbox.checked = false;
    selectAllCheckbox.indeterminate = false;
    selectAllCheckbox.disabled = true;
  } else {
    selectAllCheckbox.disabled = false;
    selectAllCheckbox.checked = visibleSelectedCount === visible.length;
    selectAllCheckbox.indeterminate =
      visibleSelectedCount > 0 && visibleSelectedCount < visible.length;
  }

  selectAllLabel.textContent = selected.size > 0 ? `${selected.size} selected` : "Select all";

  copySelectedBtn.disabled = selected.size === 0;
}

function applyFilter() {
  const words = currentFilterWords();
  const items = listEl.querySelectorAll("li[data-url]");
  let visibleCount = 0;

  items.forEach((li) => {
    const name = li.dataset.name;
    const url = li.dataset.url;
    const match = matchesFilter(name, url, words);
    li.classList.toggle("hidden", !match);
    if (match) visibleCount += 1;
  });

  countEl.textContent =
    words.length > 0 ? `${visibleCount}/${allLinks.length}` : String(allLinks.length);

  const existingEmpty = listEl.querySelector(".empty-state");
  if (words.length > 0 && visibleCount === 0) {
    if (!existingEmpty) {
      const li = document.createElement("li");
      li.className = "empty-state-item";
      const div = document.createElement("div");
      div.className = "empty-state";
      div.textContent = "No results for this search.";
      li.appendChild(div);
      listEl.appendChild(li);
    }
  } else if (existingEmpty) {
    existingEmpty.closest("li")?.remove();
  }

  updateSelectAllState();
}

function renderLinks(links) {
  allLinks = links.map((url) => ({ url, name: displayName(url) }));
  selected.clear();
  listEl.innerHTML = "";

  if (allLinks.length === 0) {
    statusEl.textContent = "No magnet links found on this page.";
    countEl.textContent = "0";
    copyAllBtn.disabled = true;
    copySelectedBtn.disabled = true;
    selectAllCheckbox.disabled = true;
    searchInput.disabled = true;
    return;
  }

  statusEl.textContent = `${allLinks.length} magnet link(s) found.`;
  countEl.textContent = String(allLinks.length);
  copyAllBtn.disabled = false;
  searchInput.disabled = false;

  for (const { url, name } of allLinks) {
    const li = document.createElement("li");
    li.dataset.url = url.toLowerCase();
    li.dataset.name = name.toLowerCase();

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.addEventListener("change", () => {
      if (checkbox.checked) selected.add(url);
      else selected.delete(url);
      updateSelectAllState();
    });

    const info = document.createElement("div");
    info.className = "magnet-info";
    info.addEventListener("click", () => {
      checkbox.checked = !checkbox.checked;
      checkbox.dispatchEvent(new Event("change"));
    });

    const label = document.createElement("span");
    label.className = "magnet-label";
    label.textContent = name;
    label.title = name;

    const urlLine = document.createElement("span");
    urlLine.className = "magnet-url";
    urlLine.textContent = url;
    urlLine.title = url;

    info.appendChild(label);
    info.appendChild(urlLine);

    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-one-btn";
    copyBtn.textContent = "Copy";
    copyBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      copyText(url, copyBtn);
    });

    li.appendChild(checkbox);
    li.appendChild(info);
    li.appendChild(copyBtn);
    listEl.appendChild(li);
  }

  updateSelectAllState();
}

searchInput.addEventListener("input", applyFilter);

selectAllCheckbox.addEventListener("change", () => {
  const shouldSelect = selectAllCheckbox.checked;
  const items = listEl.querySelectorAll("li[data-url]:not(.hidden)");
  items.forEach((li) => {
    const checkbox = li.querySelector('input[type="checkbox"]');
    const url = allLinks.find((l) => l.url.toLowerCase() === li.dataset.url)?.url;
    if (!checkbox || !url) return;
    checkbox.checked = shouldSelect;
    if (shouldSelect) selected.add(url);
    else selected.delete(url);
  });
  updateSelectAllState();
});

copyAllBtn.addEventListener("click", () => {
  copyText(allLinks.map((l) => l.url).join("\n"), copyAllBtn, "Copied!");
});

copySelectedBtn.addEventListener("click", () => {
  const urls = allLinks.filter((l) => selected.has(l.url)).map((l) => l.url);
  copyText(urls.join("\n"), copySelectedBtn, "Copied!");
});

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.id || !/^https?:/.test(tab.url || "")) {
    statusEl.textContent = "This page cannot be accessed.";
    return;
  }

  try {
    const [{ result: links }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractMagnetLinks,
    });
    renderLinks(links || []);
  } catch (err) {
    statusEl.textContent = "Unable to scan this page.";
  }
}

init();
