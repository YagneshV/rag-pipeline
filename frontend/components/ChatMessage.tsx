import type { ChatMessage } from "../lib/types";

const roleStyles = {
  user: "bg-accent text-white ml-auto",
  assistant: "bg-soft text-ink mr-auto",
};

export default function ChatMessage({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === "assistant";

  return (
    <div className="flex flex-col gap-3">
      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
          roleStyles[message.role]
        }`}
      >
        {message.content}
      </div>
      {isAssistant && message.sources && message.sources.length > 0 ? (
        <div className="grid gap-2 text-xs text-slate-600">
          {message.sources.map((source, index) => (
            <div
              key={`${source.id ?? "source"}-${index}`}
              className="rounded-xl border border-slate-200 bg-white/80 p-3 shadow-sm"
            >
              <div className="font-semibold text-slate-700">Source {index + 1}</div>
              <div className="mt-1 line-clamp-4 text-slate-600">{source.text}</div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
