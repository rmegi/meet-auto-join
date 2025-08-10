const API_BASE = "http://127.0.0.1:5005";

document.addEventListener("DOMContentLoaded", () => {
  const joinBtn = document.getElementById("join");
  const msgEl = document.getElementById("msg");
  const codeEl = document.getElementById("code");

  // Small guards so we never crash if elements are missing
  const setMsg = (t) => {
    if (msgEl) msgEl.textContent = t;
  };
  const showCode = (t) => {
    if (codeEl) codeEl.textContent = t ? `Code: ${t}` : "Code: (none)";
  };

  joinBtn?.addEventListener("click", async () => {
    setMsg("Checking server…");

    let data;
    try {
      const res = await fetch(`${API_BASE}/latest-code`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = await res.json();
    } catch (e) {
      setMsg("Network/JSON error reaching server.");
      console.error("Fetch/parse error:", e);
      return;
    }

    const raw = data?.code || "";
    const code = raw ? formatCode(raw) : "";
    showCode(code || "(none)");

    const url = code
      ? `https://meet.google.com/${code}`
      : "https://meet.google.com/";

    setMsg("Opening meeting…");
    // Use callback form (don’t await); avoids throwing into catch
    chrome.tabs.create({ url }, () => {
      if (chrome.runtime.lastError) {
        setMsg("Failed to open tab.");
        console.error("tabs.create error:", chrome.runtime.lastError);
      } else {
        setMsg("Tab opened.");
      }
    });
  });
});

function formatCode(raw) {
  const clean = (raw || "")
    .trim()
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
  if (clean.length >= 10 && clean.length <= 12) {
    return `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7)}`;
    // e.g. nizorepoxf => niz-orep-oxf
  }
  return raw; // already dashed or short
}
