import re
import secrets
import uuid
import unicodedata

from fastapi import APIRouter, Depends, HTTPException

from lib.auth import current_user, now, subscription_of, user_out, utc
from lib.db import db
from models.user import UserOut
from models.venue import OpeningDay, PublicVenueOut, Venue, VenueIn

router = APIRouter(tags=["venue"])

DAYS = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"]


def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode()
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:60]


def to_venue(doc: dict) -> Venue:
    doc = {**doc, "updated_at": utc(doc["updated_at"])}
    return Venue(**doc)


async def get_or_create_venue(user: dict) -> dict:
    doc = await db.venues.find_one({"owner_id": user["user_id"]}, {"_id": 0})
    if doc:
        return doc
    doc = {
        "id": str(uuid.uuid4()),
        "owner_id": user["user_id"],
        "slug": f"locale-{secrets.token_hex(3)}",
        "name": "",
        "category": "ristorante",
        "city": "",
        "address": "",
        "phone": "",
        "whatsapp": "",
        "description": "",
        "hours": [OpeningDay(day=d, hours="12:00-15:00, 19:00-23:00").model_dump() for d in DAYS],
        "logo": None,
        "cover": None,
        "menu": [],
        "updated_at": now(),
    }
    await db.venues.insert_one(dict(doc))
    return doc


@router.get("/venue", response_model=Venue)
async def my_venue(user: dict = Depends(current_user)):
    return to_venue(await get_or_create_venue(user))


@router.put("/venue", response_model=Venue)
async def save_venue(body: VenueIn, user: dict = Depends(current_user)):
    current = await get_or_create_venue(user)
    slug = slugify(body.slug)
    if len(slug) < 2:
        raise HTTPException(status_code=422, detail="Indirizzo pagina non valido")
    clash = await db.venues.find_one({"slug": slug, "owner_id": {"$ne": user["user_id"]}}, {"_id": 0, "id": 1})
    if clash:
        raise HTTPException(status_code=409, detail="Questo indirizzo pagina è già in uso, scegline un altro")
    data = body.model_dump()
    data["slug"] = slug
    data["updated_at"] = now()
    await db.venues.update_one({"id": current["id"]}, {"$set": data})
    return to_venue({**current, **data})


@router.get("/public/venues/{slug}", response_model=PublicVenueOut)
async def public_venue(slug: str):
    doc = await db.venues.find_one({"slug": slug.lower()}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Locale non trovato")
    owner = await db.users.find_one({"user_id": doc["owner_id"]}, {"_id": 0})
    if not owner or not subscription_of(owner).is_active:
        return PublicVenueOut(status="blocked", name=doc.get("name", ""))
    return PublicVenueOut(status="active", venue=to_venue(doc), name=doc.get("name", ""))


# ---- Abbonamento (pagamento SIMULATO) ----

@router.post("/subscription/activate", response_model=UserOut)
async def activate_pro(user: dict = Depends(current_user)):
    await db.users.update_one({"user_id": user["user_id"]}, {"$set": {"plan": "pro", "pro_since": now()}})
    user.update(plan="pro", pro_since=now())
    return user_out(user)


@router.post("/subscription/cancel", response_model=UserOut)
async def cancel_pro(user: dict = Depends(current_user)):
    await db.users.update_one({"user_id": user["user_id"]}, {"$set": {"plan": "trial", "pro_since": None}})
    user.update(plan="trial", pro_since=None)
    return user_out(user)


@router.post("/subscription/simulate-expiry", response_model=UserOut)
async def simulate_expiry(user: dict = Depends(current_user)):
    """Demo helper: ends the trial now (and drops Pro) to preview the blocked public page."""
    past = now().replace(microsecond=0)
    await db.users.update_one({"user_id": user["user_id"]}, {"$set": {"plan": "trial", "pro_since": None, "trial_ends_at": past}})
    user.update(plan="trial", pro_since=None, trial_ends_at=past)
    return user_out(user)
