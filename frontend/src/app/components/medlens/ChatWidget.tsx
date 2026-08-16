import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Send, X, Sparkles } from "lucide-react";
import { useMedLensStore } from "../../lib/store";
import { EASE } from "./anim";

export function ChatWidget() {
  const messages = useMedLensStore((s) => s.chatMessages);
  const loading = useMedLensStore((s) => s.chatLoading);
  const suggestions = useMedLensStore((s) => s.suggestedQuestions);
  const sendChat = useMedLensStore((s) => s.sendChat);
  const result = useMedLensStore((s) => s.result);

  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (messages.length > 0) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages.length]);

  useEffect(() => {
    if (open) {
      inputRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open]);

  if (result === null) return null;

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || loading) return;
    sendChat(trimmed);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat about your results"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed bottom-24 right-6 z-50 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[24px] clay bg-clay-white shadow-xl max-h-[500px] sm:max-h-[70vh]"
          >
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-3.5">
              <div className="flex items-center gap-2 font-display text-[15px] font-bold text-clay-slate">
                <Sparkles className="size-4" aria-hidden />
                Ask about your results
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-full text-clay-muted transition-colors hover:bg-clay-cream"
                aria-label="Close chat"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>

            <div
              role="log"
              aria-live="polite"
              className="flex-1 min-h-0 space-y-3 overflow-y-auto px-4 py-4"
            >
              <div className="mr-auto max-w-[85%] rounded-[16px] rounded-bl-[4px] bg-clay-cream px-4 py-2.5 text-[14px] leading-relaxed text-clay-slate">
                Hi! I've analyzed your results. Ask me anything — like what a specific number means, or what you can do to improve. 💚
              </div>
              {messages.map((msg, idx) => (
                <div
                  key={msg.timestamp + idx}
                  className={
                    msg.role === "user"
                      ? "ml-auto max-w-[85%] rounded-[16px] rounded-br-[4px] bg-clay-terracotta/10 px-4 py-2.5 text-[14px] leading-relaxed text-clay-slate"
                      : "mr-auto max-w-[85%] rounded-[16px] rounded-bl-[4px] bg-clay-cream px-4 py-2.5 text-[14px] leading-relaxed text-clay-slate"
                  }
                >
                  {msg.content}
                </div>
              ))}
              {loading && (
                <div className="mr-auto max-w-[85%] rounded-[16px] rounded-bl-[4px] bg-clay-cream px-4 py-2.5 text-[14px] leading-relaxed text-clay-slate">
                  <div className="flex items-center justify-center space-x-1 py-1">
                    <span className="animate-bounce rounded-full bg-clay-muted/50 w-1.5 h-1.5 delay-0"></span>
                    <span className="animate-bounce rounded-full bg-clay-muted/50 w-1.5 h-1.5 delay-150"></span>
                    <span className="animate-bounce rounded-full bg-clay-muted/50 w-1.5 h-1.5 delay-300"></span>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {!loading && suggestions.length > 0 && (
              <div className="flex gap-2 overflow-x-auto scrollbar-none px-4 py-2">
                {suggestions.map((chip, idx) => (
                  <button
                    key={idx}
                    onClick={() => sendChat(chip)}
                    className="cursor-pointer whitespace-nowrap rounded-full border-none bg-clay-cream px-3 py-1.5 text-[13px] text-clay-muted transition-colors hover:bg-clay-terracotta/10"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2 border-t border-black/5 px-4 py-3">
              <div className="flex-1 relative flex items-center">
                 <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type your question..."
                    aria-label="Type your question"
                    maxLength={500}
                    className="flex-1 rounded-[12px] clay-inset border-none bg-transparent px-3 py-2 font-sans text-[14px] text-clay-slate outline-none placeholder:text-clay-muted/60"
                  />
                  {input.length > 400 && (
                    <span className="absolute right-3 text-[10px] text-clay-muted/70">
                      {input.length}/500
                    </span>
                  )}
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading}
                aria-label="Send message"
                className="grid size-9 place-items-center rounded-full bg-clay-terracotta text-white transition-opacity disabled:opacity-40"
              >
                <Send className="size-4" aria-hidden />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 grid size-14 place-items-center rounded-full clay bg-clay-terracotta text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle
          className={`size-6 ${!open && messages.length === 0 ? "animate-pulse" : ""}`}
          aria-hidden
        />
      </button>
    </>
  );
}
