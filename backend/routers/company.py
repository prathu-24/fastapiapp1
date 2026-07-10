from fastapi import APIRouter , Depends, HTTPException ,status

from schemas.company import companyCreate, companyUpdate ,companyResponse
from models.company import Company
from models.job import Job  # Required: ensures Job model is registered for SQLAlchemy relationship resolution
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from sqlalchemy.orm import selectinload
from database import get_db
from utils.oauth2 import role_required,get_current_user



router = APIRouter(prefix="/company", tags=["company"])



@router.post("/",status_code=status.HTTP_201_CREATED,
response_model=companyResponse)
async def create_company(company: companyCreate,db: AsyncSession = Depends(get_db),current_user = Depends(role_required(["admin"]))):
    result = await db.execute(select(Company).filter(Company.email == company.email))
    existing_company = result.scalars().first()
    if existing_company:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Company with this email already exists"
        )
    db_company = Company(**company.dict())
    db.add(db_company)
    await db.commit()
    
    # Eagerly load the jobs relationship to prevent MissingGreenlet error on serialization
    result = await db.execute(select(Company).filter(Company.id == db_company.id).options(selectinload(Company.jobs)))
    return result.scalars().first()


@router.get("/",status_code=status.HTTP_200_OK,
response_model=list[companyResponse])
async def get_all_company(db: AsyncSession = Depends(get_db)):
    # Eagerly load the jobs relationship to prevent MissingGreenlet error on serialization
    result = await db.execute(select(Company).options(selectinload(Company.jobs)))
    return result.scalars().all()

@router.get("/{company_id}",status_code=status.HTTP_200_OK,
response_model=companyResponse)
async def read_company(company_id: int, db: AsyncSession = Depends(get_db),current_user = Depends(role_required(["admin"]))):
    # Eagerly load the jobs relationship to prevent MissingGreenlet error on serialization
    result = await db.execute(select(Company).filter(Company.id == company_id).options(selectinload(Company.jobs)))
    db_company = result.scalars().first()
    if not db_company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    return db_company

@router.put("/{company_id}",status_code=status.HTTP_200_OK,
response_model=companyResponse)
async def update_company(company_id: int, company: companyUpdate, db: AsyncSession = Depends(get_db),current_user = Depends(role_required(["admin"]))):
    result = await db.execute(select(Company).filter(Company.id == company_id))
    db_company = result.scalars().first()
    if not db_company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    # pyrefly: ignore [deprecated]
    update_data = company.dict(exclude_unset=True)
    if "email" in update_data and update_data["email"] != db_company.email:
        result2 = await db.execute(select(Company).filter(Company.email == update_data["email"]))
        existing_company = result2.scalars().first()
        if existing_company:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Company with this email already exists"
            )
    for key, value in update_data.items():
        setattr(db_company, key, value)
    await db.commit()
    
    # Eagerly load the jobs relationship to prevent MissingGreenlet error on serialization
    result = await db.execute(select(Company).filter(Company.id == company_id).options(selectinload(Company.jobs)))
    return result.scalars().first()

@router.delete("/{company_id}",status_code=status.HTTP_200_OK)
async def delete_company(company_id: int, db: AsyncSession = Depends(get_db),current_user = Depends(role_required(["admin"]))):
    result = await db.execute(select(Company).filter(Company.id == company_id))
    db_company = result.scalars().first()
    if not db_company:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Company not found")
    await db.delete(db_company)
    await db.commit()
    return {"detail": "Company deleted successfully"}
