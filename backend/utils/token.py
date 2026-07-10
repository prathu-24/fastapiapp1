from fastapi import HTTPException
from jose import jwt
from datetime import datetime, timedelta
from dotenv import load_dotenv
import os
from pathlib import Path
from models.users import User
from sqlalchemy.orm import Session

# Load .env from the backend directory
load_dotenv(Path(__file__).resolve().parent.parent / ".env")
SECRETE_KEY = os.getenv("SECRETE_KEY") 
ALGORITHM = os.getenv("ALGORITHM")

def create_access_token(data: dict, expires_delta: timedelta = timedelta(hours=2)):
    to_encode = data.copy()
    expire = datetime.now() + expires_delta
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, key=SECRETE_KEY, algorithm=ALGORITHM)
    return encoded_jwt
    
    
def verify_access_token(token: str, key=SECRETE_KEY, algorithms=ALGORITHM):
    try:
        to_decode = jwt.decode(token, key, algorithms=[algorithms])
        user_id = to_decode.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid credentials")
        return to_decode
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid credentials")
