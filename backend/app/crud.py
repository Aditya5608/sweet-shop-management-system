# backend/app/crud.py
from sqlalchemy.orm import Session
from . import models, schemas, auth as _auth


# ======================
# USER CRUD
# ======================

def create_user(
    db: Session,
    username: str,
    password: str,
    is_admin: bool = False
):
    hashed_password = _auth.get_password_hash(password)
    user = models.User(
        username=username,
        hashed_password=hashed_password,
        is_admin=is_admin
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_username(db: Session, username: str):
    return (
        db.query(models.User)
        .filter(models.User.username == username)
        .first()
    )


def authenticate_user(db: Session, username: str, password: str):
    user = get_user_by_username(db, username)
    if not user:
        return None
    if not _auth.verify_password(password, user.hashed_password):
        return None
    return user


# ======================
# SWEETS CRUD
# ======================

def create_sweet(db: Session, sweet: schemas.SweetCreate):
    db_sweet = models.Sweet(**sweet.model_dump())
    db.add(db_sweet)
    db.commit()
    db.refresh(db_sweet)
    return db_sweet


def get_sweets(db: Session, skip: int = 0, limit: int = 100):
    return (
        db.query(models.Sweet)
        .offset(skip)
        .limit(limit)
        .all()
    )


def get_sweet(db: Session, sweet_id: int):
    return (
        db.query(models.Sweet)
        .filter(models.Sweet.id == sweet_id)
        .first()
    )


def update_sweet(db: Session, sweet_id: int, data: dict):
    sweet = get_sweet(db, sweet_id)
    if not sweet:
        return None

    for key, value in data.items():
        if value is not None:
            setattr(sweet, key, value)

    db.commit()
    db.refresh(sweet)
    return sweet


def delete_sweet(db: Session, sweet_id: int):
    sweet = get_sweet(db, sweet_id)
    if not sweet:
        return False

    db.delete(sweet)
    db.commit()
    return True


def purchase_sweet(db: Session, sweet_id: int, qty: int = 1):
    sweet = get_sweet(db, sweet_id)
    if not sweet or sweet.quantity < qty:
        return None

    sweet.quantity -= qty
    db.commit()
    db.refresh(sweet)
    return sweet


def restock_sweet(db: Session, sweet_id: int, qty: int = 1):
    sweet = get_sweet(db, sweet_id)
    if not sweet:
        return None

    sweet.quantity += qty
    db.commit()
    db.refresh(sweet)
    return sweet
