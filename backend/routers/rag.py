from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from pydantic import BaseModel

from database import get_db
from services.rag_service import rag_job_search
from services.qdrant_service import embed_all_jobs
from services.resume_service import analyse_resume

router = APIRouter(prefix="/rag", tags=["rag"])


# ---------- Request / Response Schemas ----------

class RAGSearchRequest(BaseModel):
    question: str


class RAGSearchResponse(BaseModel):
    question: str
    answer: str


class EmbedJobsResponse(BaseModel):
    message: str
    jobs_embedded: int


class ResumeRequest(BaseModel):
    resume_text: str


class ResumeResponse(BaseModel):
    analysis: str


# ---------- Endpoints ----------

@router.post("/search", response_model=RAGSearchResponse)
def rag_search(request: RAGSearchRequest):
    """RAG-based job search: embeds the question, retrieves matching jobs, and answers via LLM."""
    try:
        answer = rag_job_search(request.question)
        return RAGSearchResponse(question=request.question, answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/embed-jobs", response_model=EmbedJobsResponse)
async def embed_jobs(db: AsyncSession = Depends(get_db)):
    """Embed all jobs from the database into the Qdrant vector store."""
    try:
        count = await embed_all_jobs(db)
        return EmbedJobsResponse(
            message=f"Successfully embedded {count} jobs.",
            jobs_embedded=count,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze-resume", response_model=ResumeResponse)
def analyze_resume(request: ResumeRequest):
    """Analyze a resume using LLM and return structured feedback."""
    try:
        analysis = analyse_resume(request.resume_text)
        return ResumeResponse(analysis=analysis)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
