import { useEffect, useRef } from "react";

import type { ChatMessage as ChatMessageType } from "../lib/types";
import ChatInput from "./ChatInput";
import ChatMessage from "./ChatMessage";

export default function ChatWindow({
  messages,
  onSend,
  isLoading,
  error,
}: {
  messages: ChatMessageType[];
  onSend: (message: string) => void;
  isLoading: boolean;
  error: string | null;
}) {
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto px-2 pb-6">
        <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
          {messages.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 p-6 text-sm text-slate-500">
              Upload a PDF on the left, then ask a question to get started.
            </div>
          ) : (
            messages.map((message, index) => (
              <ChatMessage key={`${message.role}-${index}`} message={message} />
            ))
          )}
          {isLoading ? (
            <div className="mr-auto max-w-[80%] rounded-2xl bg-soft px-4 py-3 text-sm text-slate-600 shadow-sm">
              Thinking...
            </div>
          ) : null}
          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>
      </div>
      <div className="border-t border-slate-200 bg-white/80 px-6 py-4">
        <div className="mx-auto w-full max-w-3xl">
          <ChatInput onSend={onSend} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
