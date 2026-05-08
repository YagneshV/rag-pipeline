import { useState } from "react";

export default function ChatInput({
  onSend,
  disabled,
}: {
  onSend: (message: string) => void;
  disabled: boolean;
}) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) {
      return;
    }
    onSend(trimmed);
    setValue("");
  };

  return (
    <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <textarea
        className="min-h-[44px] flex-1 resize-none bg-transparent text-sm text-ink outline-none placeholder:text-slate-400"
        placeholder="Ask about your documents"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter" && !event.shiftKey) {
            event.preventDefault();
            handleSend();
          }
        }}
        disabled={disabled}
      />
      <button
        className="rounded-xl bg-accent px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-accentDark disabled:cursor-not-allowed disabled:opacity-60"
        onClick={handleSend}
        disabled={disabled}
      >
        Send
      </button>
    </div>
  );
}
