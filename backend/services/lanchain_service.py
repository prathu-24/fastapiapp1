from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnableWithMessageHistory
from langchain_community.chat_message_histories import ChatMessageHistory

from services.llm_service import get_llm

# ---- In-memory session store ----
store: dict[str, ChatMessageHistory] = {}


def get_history(session_id: str) -> ChatMessageHistory:
    """
    Retrieve (or create) a ChatMessageHistory for the given session.
    Equivalent to the Colab `get_history` function.
    """
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]


# ---- Prompt with memory ----
prompt_with_memory = ChatPromptTemplate.from_messages([
    ("system", "you are a helpful AI assistant"),
    ("placeholder", "{chat_history}"),
    ("human", "{user_query}"),
])

# ---- Chain: prompt → LLM ----
chain_with_memory = prompt_with_memory | get_llm()

# ---- Runnable with automatic history management ----
chat_with_memory = RunnableWithMessageHistory(
    runnable=chain_with_memory,
    get_session_history=get_history,
    input_messages_key="user_query",
    history_messages_key="chat_history",
)


def chat_with_session(query: str, session_id: str) -> str:
    """
    Send a message within a session. The conversation history is
    automatically loaded and appended to by RunnableWithMessageHistory.
    """
    try:
        response = chat_with_memory.invoke(
            {"user_query": query},
            config={"configurable": {"session_id": session_id}},
        )
        return response.content
    except Exception as e:
        print(f"[Langchain Service Warning] Failed invoking with history: {e}. Falling back.")
        from services.llm_service import get_local_fallback_chat_response
        history = get_history(session_id)
        reply = get_local_fallback_chat_response(query)
        # Manually append to message history so it behaves like the real chain
        history.add_user_message(query)
        history.add_ai_message(reply)
        return reply



def get_session_history(session_id: str) -> list[dict]:
    """
    Return the full message history for a session as a list of dicts.
    Each dict has 'role' ('human' or 'ai') and 'content'.
    """
    history = get_history(session_id)
    messages = []
    for msg in history.messages:
        role = "human" if msg.type == "human" else "ai"
        messages.append({"role": role, "content": msg.content})
    return messages


def clear_session_history(session_id: str) -> bool:
    """Clear the chat history for a given session."""
    if session_id in store:
        store[session_id].clear()
        return True
    return False
