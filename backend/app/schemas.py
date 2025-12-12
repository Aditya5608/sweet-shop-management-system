# backend/app/schemas.py
from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str

class UserRead(BaseModel):
    id: int
    username: str
    is_admin: bool = False

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"

class SweetBase(BaseModel):
    name: str
    category: Optional[str] = None
    price: float
    quantity: int

class SweetCreate(SweetBase):
    pass

class SweetUpdate(BaseModel):
    name: Optional[str]
    category: Optional[str]
    price: Optional[float]
    quantity: Optional[int]

class SweetRead(SweetBase):
    id: int

    class Config:
        orm_mode = True
