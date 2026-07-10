import os
from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker, AsyncSession
from sqlalchemy.orm import declarative_base
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:007@localhost:5432/student_db")

# Raise a helpful error if running on Render but DATABASE_URL is not set (falling back to localhost)
if os.getenv("RENDER") == "true" and "localhost" in DATABASE_URL:
    raise ValueError(
        "DATABASE_URL environment variable is missing or misconfigured on Render. "
        "It is currently falling back to localhost, which is not supported in production. "
        "Please add a DATABASE_URL environment variable in the 'Environment' section of your Render Web Service."
    )

if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql+asyncpg://", 1)
elif DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

connect_args = {}
if "supabase.com" in DATABASE_URL or "render.com" in DATABASE_URL or "sslmode=require" in DATABASE_URL:
    DATABASE_URL = DATABASE_URL.split("?")[0]
    connect_args = {"ssl": {"sslmode": "require"}}

engine = create_async_engine(DATABASE_URL, echo=False, connect_args=connect_args)
SessionLocal = async_sessionmaker(autocommit=False, autoflush=False, bind=engine, class_=AsyncSession)
Base = declarative_base()

async def get_db():
    async with SessionLocal() as db:
        try:
            yield db
        finally:
            await db.close()

        