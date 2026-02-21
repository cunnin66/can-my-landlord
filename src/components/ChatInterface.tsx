"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { ChatMessage as ChatMessageType } from "@/types";
import ChatMessage from "./ChatMessage";
import QuickActionButtons from "./QuickActionButtons";
import LeaseUploader from "./LeaseUploader";

const STORAGE_KEY = "cml-session";

interface SavedSession {
  messages: ChatMessageType[];
  documentId: string | null;
  uploadedFilename: string | null;
}

function loadSession(): SavedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function saveSession(session: SavedSession) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage full or unavailable — silently ignore
  }
}

function clearSession() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessageType[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [documentId, setDocumentId] = useState<string | null>(null);
  const [uploadedFilename, setUploadedFilename] = useState<string | null>(null);
  const [sessionLoaded, setSessionLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load saved session on mount
  useEffect(() => {
    const saved = loadSession();
    if (saved) {
      setMessages(saved.messages);
      setDocumentId(saved.documentId);
      setUploadedFilename(saved.uploadedFilename);
    }
    setSessionLoaded(true);
  }, []);

  // Save session whenever state changes (after initial load)
  useEffect(() => {
    if (!sessionLoaded) return;
    saveSession({ messages, documentId, uploadedFilename });
  }, [messages, documentId, uploadedFilename, sessionLoaded]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewChat = useCallback(() => {
    setMessages([]);
    setDocumentId(null);
    setUploadedFilename(null);
    setInput("");
    clearSession();
  }, []);

  async function handleSend(messageText: string) {
    const trimmed = messageText.trim();
    if (!trimmed || isLoading) return;

    const userMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: "user",
      content: trimmed,
      timestamp: Date.now(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);

    const history = messages.map((m) => ({
      role: (m.role === "assistant" ? "model" : "user") as "user" | "model",
      parts: [{ text: m.content }],
    }));

    const assistantMessage: ChatMessageType = {
      id: crypto.randomUUID(),
      role: "assistant",
      content: "",
      timestamp: Date.now(),
    };

    setMessages([...updatedMessages, assistantMessage]);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: trimmed,
          documentId,
          history,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed");
      }

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let assistantContent = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        assistantContent += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMessage.id
              ? { ...m, content: assistantContent }
              : m
          )
        );
      }
    } catch {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMessage.id
            ? {
                ...m,
                content: "Sorry, something went wrong. Please try again.",
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-10" id="chat">
      <div className="mb-6">
        <LeaseUploader
          onUploaded={(docId, filename) => {
            setDocumentId(docId);
            setUploadedFilename(filename);
          }}
          onRemoved={() => {
            setDocumentId(null);
            setUploadedFilename(null);
          }}
          uploadedFilename={uploadedFilename}
        />
      </div>

      <div className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
          <span className="text-xs text-gray-500">
            {messages.length > 0
              ? `${messages.length} messages`
              : "New conversation"}
          </span>
          {messages.length > 0 && (
            <button
              onClick={handleNewChat}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
              New Chat
            </button>
          )}
        </div>

        <div className="h-[400px] overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <p className="text-gray-400 text-sm mb-6">
                {uploadedFilename
                  ? "Your lease is ready. Ask a question below or pick one to get started."
                  : "Upload your lease above, or just ask a question to get started."}
              </p>
              <QuickActionButtons onSend={handleSend} disabled={isLoading} />
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        <div className="border-t border-gray-200 p-3">
          <div className="flex gap-2">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about your tenant rights..."
              rows={1}
              disabled={isLoading}
              className="flex-1 resize-none rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:opacity-50"
            />
            <button
              onClick={() => handleSend(input)}
              disabled={isLoading || !input.trim()}
              className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send
            </button>
          </div>
          {messages.length > 0 && (
            <div className="mt-3">
              <QuickActionButtons onSend={handleSend} disabled={isLoading} />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
