# backend/app/routers/sweets.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from .. import schemas, crud, models
from ..deps import get_db, get_current_user

router = APIRouter(prefix="/api/sweets", tags=["sweets"])


@router.post("", response_model=schemas.SweetRead)
def create_sweet_endpoint(
    sweet: schemas.SweetCreate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")
    return crud.create_sweet(db, sweet)


@router.get("", response_model=List[schemas.SweetRead])
def list_sweets(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100,
):
    return crud.get_sweets(db, skip, limit)


@router.get("/search", response_model=List[schemas.SweetRead])
def search_sweets(
    name: Optional[str] = None,
    category: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    db: Session = Depends(get_db),
):
    query = db.query(models.Sweet)

    if name:
        query = query.filter(models.Sweet.name.ilike(f"%{name}%"))
    if category:
        query = query.filter(models.Sweet.category.ilike(f"%{category}%"))
    if min_price is not None:
        query = query.filter(models.Sweet.price >= min_price)
    if max_price is not None:
        query = query.filter(models.Sweet.price <= max_price)

    return query.all()


@router.put("/{sweet_id}", response_model=schemas.SweetRead)
def update_sweet(
    sweet_id: int,
    sweet: schemas.SweetUpdate,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    updated = crud.update_sweet(db, sweet_id, sweet.dict())
    if not updated:
        raise HTTPException(status_code=404, detail="Sweet not found")
    return updated


@router.delete("/{sweet_id}")
def delete_sweet(
    sweet_id: int,
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    success = crud.delete_sweet(db, sweet_id)
    if not success:
        raise HTTPException(status_code=404, detail="Not found")
    return {"detail": "Deleted"}


@router.post("/{sweet_id}/purchase", response_model=schemas.SweetRead)
def purchase(
    sweet_id: int,
    qty: int = Query(1, ge=1),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    s = crud.purchase_sweet(db, sweet_id, qty)
    if not s:
        raise HTTPException(
            status_code=400,
            detail="Insufficient stock or sweet not found",
        )
    return s


@router.post("/{sweet_id}/restock", response_model=schemas.SweetRead)
def restock(
    sweet_id: int,
    qty: int = Query(..., ge=1),
    db: Session = Depends(get_db),
    current_user=Depends(get_current_user),
):
    if not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Admin only")

    s = crud.restock_sweet(db, sweet_id, qty)
    if not s:
        raise HTTPException(status_code=404, detail="Not found")
    return s
