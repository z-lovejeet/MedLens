import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MessageCircle, Send, X, Sparkles, MessageSquarePlus } from "lucide-react";
import { useMedLensStore } from "../../lib/store";
import { EASE } from "./anim";

export function ChatWidget() {
  const messages = useMedLensStore((s) => s.chatMessages);
  const loading = useMedLensStore((s) => s.chatLoading);
  const suggestions = useMedLensStore((s) => s.suggestedQuestions);
  const sendChat = useMedLensStore((s) => s.sendChat);

  const [open, setOpen] = useState(false);
  const [popupDismissed, setPopupDismissed] = useState(false);
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

  const handleSend = () => {
    if (!input.trim() || loading) return;
    sendChat(input.trim());
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
      {/* Floating Prompt Bubble above Chat Icon */}
      <AnimatePresence>
        {!open && !popupDismissed && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: [0, -4, 0], scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{
              y: { duration: 3.5, repeat: Infinity, ease: "easeInOut" },
              duration: 0.35,
            }}
            className="fixed bottom-24 right-6 z-40 max-w-[260px] sm:max-w-[290px] rounded-[20px] clay bg-white p-3.5 border border-black/5"
          >
            <div className="flex items-start justify-between gap-2">
              <button
                onClick={() => setOpen(true)}
                className="flex items-start gap-2.5 text-left cursor-pointer group"
              >
                <span className="grid size-8 shrink-0 place-items-center rounded-[12px] bg-clay-terracotta/15 text-clay-terracotta transition-transform group-hover:scale-110">
                  <MessageSquarePlus className="size-4" aria-hidden />
                </span>
                <div>
                  <p className="text-[13px] font-bold text-clay-slate leading-tight group-hover:text-clay-terracotta transition-colors">
                    Need something translated that's not in the report? Ask here.
                  </p>
                </div>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPopupDismissed(true);
                }}
                aria-label="Dismiss message"
                className="grid size-6 place-items-center rounded-full text-clay-muted/70 hover:bg-clay-cream hover:text-clay-slate transition-colors cursor-pointer"
              >
                <X className="size-3.5" aria-hidden />
              </button>
            </div>
            {/* Small pointer tail pointing down to the FAB */}
            <div className="absolute -bottom-2 right-6 size-4 rotate-45 bg-white border-r border-b border-black/5 clay-tail" />
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat about your results"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="fixed bottom-24 right-6 z-50 flex w-[380px] max-w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-[24px] clay-lg bg-clay-white border border-black/5 max-h-[500px] sm:max-h-[70vh]"
          >
            <div className="flex items-center justify-between border-b border-black/5 px-5 py-3.5">
              <div className="flex items-center gap-2 font-display text-[15px] font-bold text-clay-slate">
                <Sparkles className="size-4 text-clay-terracotta" aria-hidden />
                Ask about your results
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid size-8 place-items-center rounded-full text-clay-muted transition-colors hover:bg-clay-cream cursor-pointer"
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
                Hi! I've analyzed your results. Ask me anything, like what a specific number means, or what you can do to improve.
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
              <div className="border-t border-black/5 bg-clay-white/80 px-4 py-2.5">
                <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-bold text-clay-muted">
                  <Sparkles className="size-3 text-clay-terracotta" aria-hidden /> Suggested questions
                </div>
                <div className="flex flex-col gap-1.5 max-h-[115px] overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {suggestions.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => sendChat(chip)}
                      className="group flex w-full items-center justify-between rounded-[12px] bg-white px-3 py-2 text-left text-[12.5px] font-semibold text-clay-slate shadow-xs border border-black/5 transition-all hover:bg-clay-cream hover:text-clay-terracotta active:scale-[0.98] cursor-pointer"
                    >
                      <span className="line-clamp-2 leading-snug">{chip}</span>
                    </button>
                  ))}
                </div>
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
                className="grid size-9 place-items-center rounded-full bg-clay-terracotta text-white transition-opacity disabled:opacity-40 clay-btn cursor-pointer"
              >
                <Send className="size-4" aria-hidden />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => {
          setOpen(!open);
          if (!open) setPopupDismissed(true);
        }}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 grid size-14 place-items-center rounded-full bg-clay-terracotta text-white clay-btn transition-transform hover:scale-105 active:scale-95 cursor-pointer"
      >
        <MessageCircle
          className={`size-7 ${!open && messages.length === 0 ? "animate-pulse" : ""}`}
          aria-hidden
        />
      </button>
    </>
  );
}
