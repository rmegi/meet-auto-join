# 📡 Google Meet Remote Joiner

This project lets you remotely open and join a Google Meet meeting on your desktop Chrome browser by sending a meeting code from another device.

---

## 🚀 How It Works

There are two main parts:

### 1. **FastAPI Server** (runs on your PC)
- Listens for POST requests from any device.
- Stores the latest Google Meet code in an **in-memory mailbox** (temporary variable in Python).
- When the Chrome extension asks for the code, it returns it and clears the mailbox.

### 2. **Chrome Extension**
- Runs in Chrome on your PC.
- Polls the FastAPI server every few seconds (`GET /next-code`) to check if a new code is available.
- If a new code is found:
  1. Formats it into a full Google Meet URL.
  2. Opens the meeting in a new tab.
  3. Uses `content.js` to auto-click the **"Join now"** button.

Endpoints:

POST /send-code — Send a meeting code to the server.
```
curl -X POST http://<PC-IP>:5005/send-code \
  -H "Content-Type: application/json" \
  -d '{"code":"niz-orep-oxf"}'