function clickJoinButton() {
  const joinBtn = document.querySelector('button[jsname="Qx7uuf"]');
  if (joinBtn) {
    joinBtn.click();
    console.log("✅ Clicked Join");
  } else {
    setTimeout(clickJoinButton, 1000);
  }
}

setTimeout(clickJoinButton, 3000);
