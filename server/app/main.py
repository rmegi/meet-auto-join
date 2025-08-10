from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import time

app = FastAPI(title="Meet Code Bridge")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

MAILBOX = {"code": None, "ts": None, "last": None}  # <-- add "last"


class MeetCode(BaseModel):
    code: str


@app.post("/send-code")
def send_code(payload: MeetCode):
    code = payload.code.strip()
    MAILBOX["code"] = code  # “unread” code (consumed by /next-code)
    MAILBOX["last"] = code  # last known code (served by /latest-code)
    MAILBOX["ts"] = int(time.time())
    return {"ok": True, "received": code}


@app.get("/next-code")
def next_code():
    """
    Returns the unread code once (then clears it), plus last for reference.
    """
    code, ts, last = MAILBOX["code"], MAILBOX["ts"], MAILBOX["last"]
    if not code:
        return {"ok": True, "code": None, "last": last, "ts": ts}
    MAILBOX["code"] = None
    return {"ok": True, "code": code, "last": last, "ts": ts}


@app.get("/latest-code")
def latest_code():
    """
    Returns the most recent code WITHOUT clearing it.
    """
    return {"ok": True, "code": MAILBOX["last"], "ts": MAILBOX["ts"]}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=5005)
