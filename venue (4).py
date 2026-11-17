from datetime import datetime
from typing import List, Literal, Optional

from pydantic import BaseModel, Field

Category = Literal["ristorante", "pizzeria", "bar", "parrucchiere", "altro"]


class MenuItem(BaseModel):
    id: str
    name: str = Field(max_length=120)
    description: str = Field(default="", max_length=600)
    price: float = Field(ge=0, le=100000)
    image: Optional[str] = None  # data URL (client-side resized)
    available: bool = True


class MenuCategory(BaseModel):
    id: str
    name: str = Field(max_length=80)
    items: List[MenuItem] = []


class OpeningDay(BaseModel):
    day: str  # "Lunedì" ... "Domenica"
    hours: str = Field(default="", max_length=80)  # free text, empty = Chiuso


class VenueIn(BaseModel):
    slug: str = Field(min_length=2, max_length=60)
    name: str = Field(default="", max_length=120)
    category: Category = "ristorante"
    city: str = Field(default="", max_length=80)
    address: str = Field(default="", max_length=200)
    phone: str = Field(default="", max_length=40)
    whatsapp: str = Field(default="", max_length=40)
    description: str = Field(default="", max_length=1500)
    hours: List[OpeningDay] = []
    logo: Optional[str] = None
    cover: Optional[str] = None
    menu: List[MenuCategory] = []


class Venue(VenueIn):
    id: str
    owner_id: str
    updated_at: datetime


class PublicVenueOut(BaseModel):
    status: Literal["active", "blocked"]
    venue: Optional[Venue] = None
    name: str = ""
