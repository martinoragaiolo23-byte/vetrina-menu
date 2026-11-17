"""Idempotent seed: owner account + demo venues. Run: cd /app/backend && python seed.py"""

import asyncio
import uuid
from datetime import timedelta

from lib.auth import new_user_doc, now, pwd
from lib.db import db, ensure_indexes

DAYS = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"]


def item(name, desc, price):
    return {"id": str(uuid.uuid4()), "name": name, "description": desc, "price": price, "image": None, "available": True}


def hours(default, closed=("Lunedì",)):
    return [{"day": d, "hours": "" if d in closed else default} for d in DAYS]


SEEDS = [
    {
        "email": "martinoragaiolo23@gmail.com",
        "password": "MenuSito2026!",
        "name": "Martino",
        "expired": False,
        "venue": {
            "slug": "trattoria-da-mario",
            "name": "Trattoria Da Mario",
            "category": "ristorante",
            "city": "Roma",
            "address": "Via della Lungaretta 42, Roma",
            "phone": "+39 06 1234567",
            "whatsapp": "+39 333 1234567",
            "description": "Cucina romana di tradizione nel cuore di Trastevere: pasta fresca tirata a mano, carbonara come una volta e vino della casa.",
            "hours": hours("12:30-15:00, 19:30-23:30"),
            "cover": "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&q=80",
            "menu": [
                {"id": str(uuid.uuid4()), "name": "Antipasti", "items": [
                    item("Supplì al telefono", "Riso, ragù e mozzarella filante", 3.5),
                    item("Carciofo alla giudia", "Carciofo romanesco fritto croccante", 7.0),
                ]},
                {"id": str(uuid.uuid4()), "name": "Primi", "items": [
                    item("Carbonara", "Guanciale croccante, pecorino romano DOP, uovo e pepe", 13.0),
                    item("Cacio e pepe", "Tonnarelli freschi, pecorino e pepe nero", 12.0),
                    item("Amatriciana", "Rigatoni, guanciale, pomodoro e pecorino", 12.5),
                ]},
                {"id": str(uuid.uuid4()), "name": "Bevande", "items": [
                    item("Vino della casa (1/4)", "Rosso o bianco dei Castelli Romani", 5.0),
                    item("Acqua minerale", "Naturale o frizzante 75cl", 2.5),
                ]},
            ],
        },
    },
    {
        "email": "demo-scaduto@menusito.it",
        "password": "Demo2026!",
        "name": "Demo Scaduto",
        "expired": True,
        "venue": {
            "slug": "pizzeria-bella-napoli",
            "name": "Pizzeria Bella Napoli",
            "category": "pizzeria",
            "city": "Napoli",
            "address": "Via dei Tribunali 10, Napoli",
            "phone": "+39 081 7654321",
            "whatsapp": "+39 333 7654321",
            "description": "Pizza napoletana verace cotta nel forno a legna.",
            "hours": hours("19:00-00:00", closed=("Martedì",)),
            "cover": None,
            "menu": [{"id": str(uuid.uuid4()), "name": "Pizze", "items": [item("Margherita", "Pomodoro San Marzano, fior di latte, basilico", 7.0)]}],
        },
    },
]


async def main():
    await ensure_indexes()
    for s in SEEDS:
        email = s["email"]
        user = await db.users.find_one({"email": email}, {"_id": 0})
        if not user:
            user = new_user_doc(email, s["name"], pwd.hash(s["password"]))
            await db.users.insert_one(dict(user))
        else:
            await db.users.update_one({"email": email}, {"$set": {"password_hash": pwd.hash(s["password"])}})
        if s["expired"]:
            await db.users.update_one({"email": email}, {"$set": {"trial_ends_at": now() - timedelta(days=1), "plan": "trial"}})
        venue = {**s["venue"], "logo": None, "owner_id": user["user_id"], "updated_at": now()}
        existing = await db.venues.find_one({"owner_id": user["user_id"]}, {"_id": 0, "id": 1})
        if existing:
            continue  # keep owner edits
        venue["id"] = str(uuid.uuid4())
        await db.venues.insert_one(venue)
    print("seed ok")


if __name__ == "__main__":
    asyncio.run(main())
