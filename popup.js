const statusEl = document.getElementById("status");
const listEl = document.getElementById("linkList");
const copyAllBtn = document.getElementById("copyAllBtn");

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

function renderLinks(links) {
  listEl.innerHTML = "";

  if (links.length === 0) {
    statusEl.textContent = "Aucun lien magnet trouvé sur cette page.";
    copyAllBtn.disabled = true;
    return;
  }

  statusEl.textContent = `${links.length} lien(s) magnet trouvé(s).`;
  copyAllBtn.disabled = false;

  for (const link of links) {
    const li = document.createElement("li");

    const label = document.createElement("span");
    label.className = "magnet-label";
    label.textContent = displayName(link);
    label.title = link;

    const copyBtn = document.createElement("button");
    copyBtn.className = "copy-one-btn";
    copyBtn.textContent = "Copier";
    copyBtn.addEventListener("click", async () => {
      await navigator.clipboard.writeText(link);
      copyBtn.textContent = "Copié !";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = "Copier";
        copyBtn.classList.remove("copied");
      }, 1200);
    });

    li.appendChild(label);
    li.appendChild(copyBtn);
    listEl.appendChild(li);
  }

  copyAllBtn.onclick = async () => {
    await navigator.clipboard.writeText(links.join("\n"));
    copyAllBtn.textContent = "Copié !";
    setTimeout(() => {
      copyAllBtn.textContent = "Copier tout";
    }, 1200);
  };
}

async function init() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  if (!tab || !tab.id || !/^https?:/.test(tab.url || "")) {
    statusEl.textContent = "Cette page n'est pas accessible.";
    return;
  }

  try {
    const [{ result: links }] = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: extractMagnetLinks,
    });
    renderLinks(links || []);
  } catch (err) {
    statusEl.textContent = "Impossible d'analyser cette page.";
  }
}

init();
