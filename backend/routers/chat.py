from fastapi import APIRouter, HTTPException
from schemas.chat import (
    ChatRequest,
    ChatResponse,
    ChatWithMemoryRequest,
    ChatWithMemoryResponse,
    ChatHistoryResponse,
    MessageSchema,
)
from services.llm_service import chat_without_memory
from services.lanchain_service import (
    chat_with_session,
    get_session_history,
    clear_session_history,
)

router = APIRouter(prefix="/chat", tags=["chat"])


@router.post("/", response_model=ChatResponse)
def simple_chat(request: ChatRequest):
    """
    Simple one-shot chat — no memory, no session.
    Equivalent to the Colab `chat_without_memory` function.
    """
    try:
        response = chat_without_memory(request.query)
        return ChatResponse(query=request.query, response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/memory", response_model=ChatWithMemoryResponse)
def chat_memory(request: ChatWithMemoryRequest):
    """
    Chat with session-based memory.
    Conversation history is automatically maintained per session_id.
    """
    try:
        response = chat_with_session(request.query, request.session_id)
        return ChatWithMemoryResponse(
            query=request.query,
            response=response,
            session_id=request.session_id,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history/{session_id}", response_model=ChatHistoryResponse)
def get_chat_history(session_id: str):
    """Retrieve the full conversation history for a session."""
    messages = get_session_history(session_id)
    return ChatHistoryResponse(
        session_id=session_id,
        messages=[MessageSchema(**msg) for msg in messages],
    )


@router.delete("/history/{session_id}")
def delete_chat_history(session_id: str):
    """Clear the conversation history for a session."""
    cleared = clear_session_history(session_id)
    if not cleared:
        raise HTTPException(status_code=404, detail="Session not found")
    return {"message": f"History for session '{session_id}' cleared."}
