"use client";

import { useMemo, useState } from "react";

import ChatWindow from "../components/ChatWindow";
import Sidebar from "../components/Sidebar";
import type { ChatMessage, UploadedFile, UploadStatus } from "../lib/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://127.0.0.1:8000";

export default function Home() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateFileStatus = (fileName: string, status: UploadStatus) => {
    setUploadedFiles((prev) => {
      const existing = prev.find((file) => file.name === fileName);
      if (!existing) {
        return [...prev, { name: fileName, status }];
      }
      return prev.map((file) =>
        file.name === fileName ? { ...file, status } : file
      );
    });
  };

  const handleSend = async (message: string) => {
    if (isLoading) {
      return;
    }

    const historySnapshot = messages.slice(-4);
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: message,
          history: historySnapshot,
        }),
      });

      if (!response.ok) {
        throw new Error("Chat request failed. Please try again.");
      }

      const data = (await response.json()) as {
        answer?: string;
        sources?: { id?: string; text: string; metadata?: Record<string, unknown> }[];
      };

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer ?? "No answer returned.",
          sources: data.sources,
        },
      ]);
    } catch (err) {
      const messageText =
        err instanceof Error ? err.message : "Something went wrong.";
      setError(messageText);
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyles = useMemo(
    () =>
      "grid min-h-screen grid-cols-1 lg:grid-cols-[320px_1fr] gap-0",
    []
  );

  return (
    <div className={containerStyles}>
      <Sidebar uploadedFiles={uploadedFiles} onStatusChange={updateFileStatus} />
      <main className="flex h-screen flex-col bg-white/70">
        <div className="flex h-full flex-col">
          <div className="border-b border-slate-200 px-8 py-6">
            <div className="text-lg font-semibold text-ink">Chat</div>
            <div className="text-sm text-slate-500">
              Ask questions about the PDFs you have uploaded.
            </div>
          </div>
          <ChatWindow
            messages={messages}
            onSend={handleSend}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </main>
    </div>
  );
}
