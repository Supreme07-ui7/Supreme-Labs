"use client";

import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "ai" | "user";
  text: string;
};

export default function AIChatPage() {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hello 👋 Welcome to Supreme Labs AI. How can I help you today?",
    },
  ]);

  const [loading, setLoading] = useState(false);

  // Sidebar open / close
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // --------------------------------
  // Safe text converter
  // --------------------------------
  const makeSafeText = (value: unknown): string => {
    if (typeof value === "string") {
      return value;
    }

    if (value === null || value === undefined) {
      return "";
    }

    if (typeof value === "object") {
      try {
        return JSON.stringify(value, null, 2);
      } catch {
        return String(value);
      }
    }

    return String(value);
  };

  // --------------------------------
  // Auto Scroll
  // --------------------------------
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // --------------------------------
  // New Chat
  // --------------------------------
  const newChat = () => {
    setMessages([
      {
        role: "ai",
        text: "New chat started 🚀 How can I help you?",
      },
    ]);

    setMessage("");
    setLoading(false);
  };

  // --------------------------------
  // Send Message
  // --------------------------------
  const sendMessage = async () => {
    if (!message.trim() || loading) return;

    const userMessage = message.trim();

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: userMessage,
      },
      {
        role: "ai",
        text: "",
      },
    ]);

    setMessage("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      const safeReply = makeSafeText(data?.reply);

      setMessages((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          role: "ai",
          text: safeReply || "No response received.",
        };

        return updated;
      });
    } catch (error) {
      console.error("AI Chat Error:", error);

      setMessages((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          role: "ai",
          text: "⚠️ Sorry, AI connection failed.",
        };

        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  // --------------------------------
  // Page
  // --------------------------------
  return (
    <main className="min-h-screen bg-[#09090B] text-white flex overflow-hidden">
      
      {/* ========================================
          SIDEBAR
      ======================================== */}

      <aside
        className={`
          fixed md:relative
          left-0 top-0 bottom-0
          z-50
          w-72
          bg-[#0D0D10]
          border-r border-white/10
          flex flex-col
          transition-transform duration-300
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full md:-translate-x-full"
          }
        `}
      >
        {/* Sidebar Header */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              Supreme Labs
            </h1>

            <p className="text-[11px] text-white/40">
              Intelligent Workspace
            </p>
          </div>

          {/* Close Sidebar */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="w-9 h-9 rounded-xl hover:bg-white/10 flex items-center justify-center transition"
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* New Chat */}
        <div className="p-4">
          <button
            onClick={newChat}
            className="
              w-full
              flex
              items-center
              justify-center
              gap-2
              rounded-xl
              bg-white/10
              hover:bg-white/15
              border
              border-white/10
              py-3
              transition
              font-medium
            "
          >
            <span className="text-lg">＋</span>
            New Chat
          </button>
        </div>

        {/* Recent Chats */}
        <div className="px-4">
          <p className="text-[11px] uppercase tracking-wider text-white/35 px-2 mb-3">
            Recent Chats
          </p>

          <div className="space-y-1">
            <button
              className="
                w-full
                text-left
                rounded-xl
                px-3
                py-3
                bg-white/5
                hover:bg-white/10
                transition
                text-sm
              "
            >
              <div className="flex items-center gap-3">
                <span className="text-base">🤖</span>

                <div className="min-w-0">
                  <p className="truncate">
                    AI Assistant
                  </p>

                  <p className="text-[11px] text-white/35 mt-0.5">
                    Current conversation
                  </p>
                </div>
              </div>
            </button>

            <button
              className="
                w-full
                text-left
                rounded-xl
                px-3
                py-3
                hover:bg-white/5
                transition
                text-sm
              "
            >
              <div className="flex items-center gap-3">
                <span className="text-base">💻</span>

                <div className="min-w-0">
                  <p className="truncate">
                    Code Helper
                  </p>

                  <p className="text-[11px] text-white/35 mt-0.5">
                    Previous chat
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Sidebar Bottom */}
        <div className="mt-auto p-4 border-t border-white/10">
          <div className="rounded-xl bg-white/5 border border-white/5 p-3">
            <p className="text-xs font-medium">
              Supreme Labs AI
            </p>

            <p className="text-[11px] text-white/35 mt-1">
              Your intelligent workspace
            </p>
          </div>
        </div>
      </aside>

      {/* ========================================
          MOBILE SIDEBAR OVERLAY
      ======================================== */}

      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="
            fixed
            inset-0
            bg-black/60
            z-40
            md:hidden
          "
          aria-label="Close sidebar overlay"
        />
      )}

      {/* ========================================
          MAIN AREA
      ======================================== */}

      <section className="flex-1 flex flex-col min-h-screen min-w-0">

        {/* ========================================
            HEADER
        ======================================== */}

        <header className="h-16 border-b border-white/10 flex items-center px-4 md:px-6 shrink-0">

          {/* Sidebar Bubble */}
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="
                w-10
                h-10
                rounded-xl
                bg-white/10
                hover:bg-white/15
                border
                border-white/10
                flex
                items-center
                justify-center
                transition
                mr-3
              "
              aria-label="Open sidebar"
            >
              ☰
            </button>
          )}

          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">
              🤖 AI Chat Assistant
            </h2>

            <p className="text-xs text-white/35 truncate">
              Supreme Labs Intelligent Workspace
            </p>
          </div>

          {/* Desktop Sidebar Toggle Bubble */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="
              hidden md:flex
              w-10
              h-10
              rounded-xl
              bg-white/5
              hover:bg-white/10
              border
              border-white/10
              items-center
              justify-center
              transition
            "
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? "‹" : "☰"}
          </button>
        </header>

        {/* ========================================
            PART 2 STARTS HERE
        ======================================== */}

        {/* 
          IMPORTANT:
          Part 2 yahan se continue hoga.
        */}
                {/* ========================================
            CHAT AREA
        ======================================== */}

        <div className="flex-1 overflow-y-auto">
          <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-8">

            <div className="space-y-6">

              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                const isLastMessage = index === messages.length - 1;

                return (
                  <div
                    key={index}
                    className={`
                      flex gap-3 md:gap-4
                      ${
                        isUser
                          ? "justify-end"
                          : "justify-start"
                      }
                    `}
                  >

                    {/* ==================================
                        AI AVATAR
                    ================================== */}

                    {!isUser && (
                      <div
                        className="
                          shrink-0
                          w-9
                          h-9
                          rounded-xl
                          bg-white/10
                          border
                          border-white/10
                          flex
                          items-center
                          justify-center
                          text-lg
                          shadow-lg
                        "
                      >
                        🤖
                      </div>
                    )}

                    {/* ==================================
                        MESSAGE
                    ================================== */}

                    <div
                      className={`
                        max-w-[85%]
                        md:max-w-[75%]
                        ${
                          isUser
                            ? "items-end"
                            : "items-start"
                        }
                        flex
                        flex-col
                      `}
                    >

                      {/* User Label */}
                      {isUser && (
                        <span className="text-[11px] text-white/30 mb-1 px-1">
                          You
                        </span>
                      )}

                      {/* AI Label */}
                      {!isUser && (
                        <span className="text-[11px] text-white/30 mb-1 px-1">
                          Supreme Labs AI
                        </span>
                      )}

                      <div
                        className={`
                          rounded-2xl
                          px-4
                          py-3
                          text-sm
                          md:text-[15px]
                          leading-7
                          ${
                            isUser
                              ? `
                                bg-white
                                text-black
                                rounded-br-md
                              `
                              : `
                                bg-white/[0.04]
                                border
                                border-white/[0.07]
                                text-white/90
                                rounded-bl-md
                              `
                          }
                        `}
                      >

                        {/* ============================
                            AI MESSAGE
                        ============================ */}

                        {!isUser ? (
                          msg.text ? (
                            <div
                              className="
                                prose
                                prose-invert
                                max-w-none
                                prose-p:my-2
                                prose-headings:font-semibold
                                prose-headings:text-white
                                prose-strong:text-white
                                prose-code:text-white
                                prose-pre:bg-black/40
                                prose-pre:border
                                prose-pre:border-white/10
                                prose-pre:rounded-xl
                                prose-ul:my-2
                                prose-ol:my-2
                                prose-li:my-1
                                prose-a:text-white
                                prose-a:underline
                              "
                            >
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                              >
                                {msg.text}
                              </ReactMarkdown>
                            </div>
                          ) : (
                            /* ==========================
                               THINKING STATE
                            ========================== */

                            loading &&
                            isLastMessage && (
                              <div className="flex items-center gap-2 text-white/50">
                                <span>Thinking</span>

                                <span className="flex gap-1">
                                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:-0.3s]" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce [animation-delay:-0.15s]" />
                                  <span className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" />
                                </span>
                              </div>
                            )
                          )
                        ) : (

                          /* ============================
                             USER MESSAGE
                          ============================ */

                          <div className="whitespace-pre-wrap break-words">
                            {msg.text}
                          </div>
                        )}

                      </div>
                    </div>

                  </div>
                );
              })}

              {/* Scroll Target */}
              <div ref={chatEndRef} />

            </div>
          </div>
        </div>

        {/* ========================================
            INPUT AREA
        ======================================== */}

        <div className="shrink-0 border-t border-white/10 bg-[#09090B]/95 backdrop-blur-xl">

          <div className="w-full max-w-4xl mx-auto px-4 md:px-6 py-4">

            <div
              className="
                relative
                flex
                items-end
                gap-2
                bg-white/[0.04]
                border
                border-white/10
                rounded-2xl
                p-2
                focus-within:border-white/20
                transition
              "
            >

              {/* ==================================
                  TEXTAREA
              ================================== */}

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Message Supreme Labs AI..."
                rows={1}
                disabled={loading}
                className="
                  flex-1
                  resize-none
                  bg-transparent
                  outline-none
                  border-none
                  text-white
                  placeholder:text-white/25
                  text-sm
                  md:text-[15px]
                  leading-6
                  px-3
                  py-2
                  max-h-40
                  overflow-y-auto
                  disabled:opacity-50
                "
              />

              {/* ==================================
                  SEND BUTTON
              ================================== */}

              <button
                onClick={sendMessage}
                disabled={!message.trim() || loading}
                className="
                  shrink-0
                  w-10
                  h-10
                  rounded-xl
                  bg-white
                  text-black
                  flex
                  items-center
                  justify-center
                  transition
                  hover:scale-105
                  active:scale-95
                  disabled:opacity-30
                  disabled:hover:scale-100
                  disabled:cursor-not-allowed
                "
                aria-label="Send message"
              >
                ↑
              </button>

            </div>

            {/* ==================================
                INPUT HELP TEXT
            ================================== */}

            <div className="flex items-center justify-center mt-2">
              <p className="text-[10px] md:text-[11px] text-white/25">
                Enter to send · Shift + Enter for new line
              </p>
            </div>

          </div>
        </div>

      </section>
    </main>
  );
}