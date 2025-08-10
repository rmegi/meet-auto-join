// Try to auto-join a few common buttons/selectors.
// We retry because Meet UI loads progressively.
const TRY_MS = 1000;
const START_DELAY_MS = 3000;
let tries = 0;
const MAX_TRIES = 60; // ~1 minute

function clickIfExists(sel) {
  const el = document.querySelector(sel);
  if (el) {
    el.click();
    return true;
  }
  return false;
}

function tryJoin() {
  tries += 1;
  // Common "Join now" buttons (selectors can change; we try a few)
  const clicked =
    clickIfExists('button[jsname="Qx7uuf"]') || // "Join now"
    clickIfExists('button[aria-label*="Join now"]') ||
    clickIfExists('div[role="button"][data-mdc-dialog-action]');

  if (clicked) {
    console.log("✅ Clicked Join button");
    return;
  }

  if (tries < MAX_TRIES) {
    setTimeout(tryJoin, TRY_MS);
  } else {
    console.log("⚠️ Could not find Join button.");
  }
}

// Give Meet a moment to load
setTimeout(tryJoin, START_DELAY_MS);
