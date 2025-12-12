# backend/app/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from .. import schemas, crud, auth as _auth
from ..deps import get_db

router = APIRouter(prefix="/api/auth", tags=["auth"])

@router.post("/register", response_model=schemas.UserRead)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    existing = crud.get_user_by_username(db, user.username)
    if existing:
        raise HTTPException(status_code=400, detail="Username already registered")
    new_user = crud.create_user(db, user.username, user.password)
    return new_user

@router.post("/login", response_model=schemas.Token)
def login(form: schemas.UserCreate, db: Session = Depends(get_db)):
    user = crud.authenticate_user(db, form.username, form.password)
    if not user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    token = _auth.create_access_token({"sub": user.username})
    return {"access_token": token}
