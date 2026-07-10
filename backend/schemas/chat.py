from pydantic import BaseModel
from typing import Optional, List


# ---------- Request Schemas ----------

class ChatRequest(BaseModel):
    """Request schema for simple chat without memory."""
    query: str


class ChatWithMemoryRequest(BaseModel):
    """Request schema for chat with session-based memory."""
    query: str
    session_id: str


# ---------- Response Schemas ----------

class ChatResponse(BaseModel):
    """Response schema for simple chat."""
    query: str
    response: str


class ChatWithMemoryResponse(BaseModel):
    """Response schema for chat with memory (includes session info)."""
    query: str
    response: str
    session_id: str


# ---------- Message Schemas (for history display) ----------

class MessageSchema(BaseModel):
    """Schema representing a single chat message."""
    role: str  # "human" or "ai"
    content: str


class ChatHistoryResponse(BaseModel):
    """Response schema for retrieving chat history of a session."""
    session_id: str
    messages: List[MessageSchema]
