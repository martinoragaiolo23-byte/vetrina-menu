"""Session helpers: one session_token (httpOnly cookie) for both email/password and Google login."""

import secrets
from datetime import datetime, timedelta, timezone
from typing import Optional

from fastapi import HTTPException, Request, Response
from passlib.context import CryptContext

from lib.db import db
from models.user import Subscription, UserOut

pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
SESSION_DAYS = 7
TRIAL_DAYS = 7


def utc(dt: datetime) -> datetime:
    if isinstance(dt, str):
        dt = datetime.fromisoformat(dt)
    return dt if dt.tzinfo else dt.replace(tzinfo=timezone.utc)


def now() -> datetime:
    return datetime.now(timezone.utc)


def new_user_doc(email: str, name: str, password_hash: Optional[str] = None, picture: Optional[str] = None) -> dict:
    import uuid

    created = now()
    return {
        "user_id": f"user_{uuid.uuid4().hex[:12]}",
        "email": email.lower(),
        "name": name,
        "picture": picture,
        "password_hash": password_hash,
        "created_at": created,
        "trial_ends_at": created + timedelta(days=TRIAL_DAYS),
        "plan": "trial",
        "pro_since": None,
    }


def subscription_of(user: dict) -> Subscription:
    trial_end = utc(user["trial_ends_at"])
    pro = user.get("plan") == "pro"
    remaining = (trial_end - now()).total_seconds()
    days_left = max(0, int(-(-remaining // 86400))) if remaining > 0 else 0
    active = pro or remaining > 0
    plan = "pro" if pro else ("trial" if remaining > 0 else "expired")
    return Subscription(
        plan=plan,
        is_active=active,
        trial_ends_at=trial_end,
        days_left=days_left,
        pro_since=utc(user["pro_since"]) if user.get("pro_since") else None,
    )


def user_out(user: dict) -> UserOut:
    return UserOut(
        user_id=user["user_id"],
        email=user["email"],
        name=user["name"],
        picture=user.get("picture"),
        created_at=utc(user["created_at"]),
        subscription=subscription_of(user),
    )


async def create_session(response: Response, user_id: str, token: Optional[str] = None) -> None:
    token = token or secrets.token_urlsafe(32)
    await db.user_sessions.insert_one(
        {"session_token": token, "user_id": user_id, "expires_at": now() + timedelta(days=SESSION_DAYS), "created_at": now()}
    )
    response.set_cookie(
        "session_token", token, httponly=True, secure=True, samesite="none", path="/", max_age=SESSION_DAYS * 86400
    )


def _token(request: Request) -> Optional[str]:
    token = request.cookies.get("session_token")
    if token:
        return token
    auth = request.headers.get("Authorization", "")
    return auth[7:] if auth.startswith("Bearer ") else None


async def current_user(request: Request) -> dict:
    token = _token(request)
    if not token:
        raise HTTPException(status_code=401, detail="Non autenticato")
    session = await db.user_sessions.find_one({"session_token": token}, {"_id": 0})
    if not session or utc(session["expires_at"]) < now():
        raise HTTPException(status_code=401, detail="Sessione scaduta")
    user = await db.users.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Utente non trovato")
    return user
