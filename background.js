// Set your Google Meet meeting info here
const meetingURL = "https://meet.google.com/eox-snpm-key"; // Replace with your link
// === CONFIGURATION ===

// === TIME SETUP: 1 minute from now ===
const oneMinuteLater = new Date(Date.now() + 60 * 1000); // 1 minute = 60,000 ms

// Set alarm when extension is installed or reloaded
chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("join-meeting", { when: oneMinuteLater.getTime() });
  console.log("✅ Alarm set for:", oneMinuteLater.toISOString());
});

// Open the Google Meet tab when alarm triggers
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "join-meeting") {
    chrome.tabs.create({ url: meetingURL });
    console.log("🚀 Opening Meet link:", meetingURL);
  }
});
