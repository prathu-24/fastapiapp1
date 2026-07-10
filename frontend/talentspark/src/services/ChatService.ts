import api from "./api";

export interface ChatMessage {
  role: "human" | "ai";
  content: string;
}

export interface ChatResponse {
  query: string;
  response: string;
  session_id?: string;
}

export interface ChatHistoryResponse {
  session_id: string;
  messages: ChatMessage[];
}

/** Simple one-shot chat (no memory) */
export const sendMessage = async (query: string): Promise<ChatResponse> => {
  const res = await api.post<ChatResponse>("/chat/", { query });
  return res.data;
};

/** Chat with session-based memory */
export const sendMessageWithMemory = async (
  query: string,
  sessionId: string
): Promise<ChatResponse> => {
  const res = await api.post<ChatResponse>("/chat/memory", {
    query,
    session_id: sessionId,
  });
  return res.data;
};

/** Get chat history for a session */
export const getChatHistory = async (
  sessionId: string
): Promise<ChatHistoryResponse> => {
  const res = await api.get<ChatHistoryResponse>(
    `/chat/history/${sessionId}`
  );
  return res.data;
};

/** Clear chat history for a session */
export const clearChatHistory = async (sessionId: string): Promise<void> => {
  await api.delete(`/chat/history/${sessionId}`);
};
