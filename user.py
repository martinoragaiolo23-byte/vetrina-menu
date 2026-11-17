from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, Field

Plan = Literal["trial", "pro", "expired"]


class RegisterIn(BaseModel):
    name: str = Field(min_length=1, max_length=120)
    email: EmailStr
    password: str = Field(min_length=6, max_length=128)


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class GoogleSessionIn(BaseModel):
    session_id: str


class Subscription(BaseModel):
    plan: Plan
    is_active: bool
    trial_ends_at: datetime
    days_left: int
    pro_since: Optional[datetime] = None
    price_eur: int = 29


class UserOut(BaseModel):
    user_id: str
    email: str
    name: str
    picture: Optional[str] = None
    created_at: datetime
    subscription: Subscription
