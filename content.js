function clickJoinButton() {
  const joinBtn = document.querySelector('button[jsname="Qx7uuf"]'); // "Join now"
  if (joinBtn) {
    joinBtn.click();
    console.log("✅ Clicked Join Now");
  } else {
    console.log("⏳ Waiting for Join button...");
    setTimeout(clickJoinButton, 1000); // Try again after 1 second
  }
}

// Give the page some time to load
setTimeout(clickJoinButton, 3000);
