import httpx
from fastapi import APIRouter, Depends, HTTPException, Request, Response

from lib.auth import create_session, current_user, new_user_doc, pwd, user_out
from lib.db import db
from models.user import GoogleSessionIn, LoginIn, RegisterIn, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])

EMERGENT_SESSION_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"


@router.post("/register", response_model=UserOut)
async def register(body: RegisterIn, response: Response):
    email = body.email.lower()
    if await db.users.find_one({"email": email}):
        raise HTTPException(status_code=409, detail="Esiste già un account con questa email")
    user = new_user_doc(email, body.name.strip(), pwd.hash(body.password))
    await db.users.insert_one(dict(user))
    await create_session(response, user["user_id"])
    return user_out(user)


@router.post("/login", response_model=UserOut)
async def login(body: LoginIn, response: Response):
    user = await db.users.find_one({"email": body.email.lower()}, {"_id": 0})
    if not user or not user.get("password_hash") or not pwd.verify(body.password, user["password_hash"]):
        raise HTTPException(status_code=401, detail="Email o password non corretti")
    await create_session(response, user["user_id"])
    return user_out(user)


@router.post("/google-session", response_model=UserOut)
async def google_session(body: GoogleSessionIn, response: Response):
    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(EMERGENT_SESSION_URL, headers={"X-Session-ID": body.session_id})
    if r.status_code != 200:
        raise HTTPException(status_code=401, detail="Accesso con Google non valido")
    data = r.json()
    email = data["email"].lower()
    user = await db.users.find_one({"email": email}, {"_id": 0})
    if user:
        await db.users.update_one({"user_id": user["user_id"]}, {"$set": {"picture": data.get("picture")}})
        user["picture"] = data.get("picture")
    else:
        user = new_user_doc(email, data.get("name") or email.split("@")[0], picture=data.get("picture"))
        await db.users.insert_one(dict(user))
    await create_session(response, user["user_id"], token=data["session_token"])
    return user_out(user)


@router.get("/me", response_model=UserOut)
async def me(user: dict = Depends(current_user)):
    return user_out(user)


@router.post("/logout")
async def logout(request: Request, response: Response):
    token = request.cookies.get("session_token")
    if token:
        await db.user_sessions.delete_one({"session_token": token})
    response.delete_cookie("session_token", path="/", secure=True, samesite="none")
    return {"ok": True}
