document.getElementById("joinBtn").addEventListener("click", () => {
  const code = document
    .getElementById("codeInput")
    .value.trim()
    .replace(/\s+/g, "");

  if (!/^[a-z0-9-]{6,12}$/i.test(code)) {
    alert("Please enter a valid Meet code (e.g., abc-def)");
    return;
  }

  const formatted = code.includes("-") ? code : code.match(/.{1,3}/g).join("-");
  const url = `https://meet.google.com/${formatted}`;

  chrome.tabs.create({ url });
});
