# backend/app/models.py
from sqlalchemy import Column, Integer, String, Float, Boolean
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_admin = Column(Boolean, default=False)

class Sweet(Base):
    __tablename__ = "sweets"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True, nullable=False)
    category = Column(String, index=True, nullable=True)
    price = Column(Float, nullable=False)
    quantity = Column(Integer, default=0)
