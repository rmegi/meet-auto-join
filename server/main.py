from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import time

app = FastAPI(title="Meet Code Bridge")

# Allow local extension polling
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later if you like
    allow_methods=["*"],
    allow_headers=["*"],
)

# Simple in-memory "mailbox"
MAILBOX = {"code": None, "ts": None}


class MeetCode(BaseModel):
    code: str
    start_in_seconds: Optional[int] = 0


@app.post("/send-code")
def send_code(payload: MeetCode):
    code = payload.code.strip()
    if not code:
        return {"ok": False, "error": "Empty code"}

    MAILBOX["code"] = code
    MAILBOX["ts"] = int(time.time())
    return {"ok": True, "received": code}


@app.get("/next-code")
def next_code():
    """
    Polled by the Chrome extension every few seconds.
    Returns the latest code once, then clears it.
    """
    code = MAILBOX["code"]
    ts = MAILBOX["ts"]
    if not code:
        return {"ok": True, "code": None, "ts": ts}

    # Deliver once, then clear
    MAILBOX["code"] = None
    return {"ok": True, "code": code, "ts": ts}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=5005)
