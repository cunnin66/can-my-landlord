export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export interface UploadResponse {
  documentId: string;
  filename: string;
  pageCount: number;
  textPreview: string;
}

export interface ChatRequest {
  message: string;
  documentId?: string;
  history: ChatHistoryEntry[];
  location?: {
    city?: string;
    state?: string;
  };
}

export interface ChatHistoryEntry {
  role: "user" | "model";
  parts: Array<{ text: string }>;
}
