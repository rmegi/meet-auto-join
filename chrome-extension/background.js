// Poll FastAPI for a new code every N seconds and open Meet.
const POLL_MS = 3000;
const API_BASE = "http://localhost:5005";

function formatCode(raw) {
  // Strip non-alphanumerics, then format as XXX-XXXX-XXX (if length 10-12)
  const clean = (raw || "")
    .trim()
    .replace(/[^a-z0-9]/gi, "")
    .toLowerCase();
  if (clean.length >= 10 && clean.length <= 12) {
    // Try 3-4-3 grouping
    return `${clean.slice(0, 3)}-${clean.slice(3, 7)}-${clean.slice(7)}`;
  }
  // If user already passed with dashes or short code, just return raw
  return raw;
}

async function poll() {
  try {
    const res = await fetch(`${API_BASE}/next-code`, { method: "GET" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data && data.code) {
      const code = data.code.includes("-") ? data.code : formatCode(data.code);
      const url = `https://meet.google.com/${code}`;
      console.log("🚀 Opening Meet:", url);
      chrome.tabs.create({ url });
    }
  } catch (err) {
    console.warn("Polling error:", err.message);
  } finally {
    setTimeout(poll, POLL_MS);
  }
}

// Start polling as soon as the service worker wakes up
poll();
