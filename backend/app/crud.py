# backend/app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas, auth as _auth

def create_user(db: Session, username: str, password: str, is_admin: bool=False):
    hashed = _auth.get_password_hash(password)
    user = models.User(username=username, hashed_password=hashed, is_admin=is_admin)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def get_user_by_username(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not _auth.verify_password(password, user.hashed_password):
        return None
    return user

# Sweets CRUD
def create_sweet(db: Session, sweet: schemas.SweetCreate):
    db_sweet = models.Sweet(**sweet.dict())
    db.add(db_sweet)
    db.commit()
    db.refresh(db_sweet)
    return db_sweet

def get_sweets(db: Session, skip: int=0, limit: int=100):
    return db.query(models.Sweet).offset(skip).limit(limit).all()

def get_sweet(db: Session, sweet_id: int):
    return db.query(models.Sweet).filter(models.Sweet.id == sweet_id).first()

def update_sweet(db: Session, sweet_id: int, data: dict):
    s = get_sweet(db, sweet_id)
    if not s:
        return None
    for key, value in data.items():
        if value is not None:
            setattr(s, key, value)
    db.commit()
    db.refresh(s)
    return s

def delete_sweet(db: Session, sweet_id: int):
    s = get_sweet(db, sweet_id)
    if not s:
        return False
    db.delete(s)
    db.commit()
    return True

def purchase_sweet(db: Session, sweet_id: int, qty: int=1):
    s = get_sweet(db, sweet_id)
    if not s or s.quantity < qty:
        return None
    s.quantity -= qty
    db.commit()
    db.refresh(s)
    return s

def restock_sweet(db: Session, sweet_id: int, qty: int=1):
    s = get_sweet(db, sweet_id)
    if not s:
        return None
    s.quantity += qty
    db.commit()
    db.refresh(s)
    return s
