
from pydantic import BaseModel
from typing import Optional
from .job import JobResponse

class companyBase(BaseModel):
    name: str

class companyCreate(companyBase):
    email: str
    phone: str
    location: str

class companyUpdate(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None

class companyResponse(companyBase):
    id: int
    email: Optional[str] = None
    phone: Optional[str] = None
    location: Optional[str] = None
    jobs: list[JobResponse]

    class Config:
        from_attributes = True

