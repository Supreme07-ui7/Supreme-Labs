"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Message = {
  role: "ai" | "user";
  text: string;
};
type ChatHistory = {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
};
type CodeBlockProps = {
  inline?: boolean;
  className?: string;
  children?: React.ReactNode;
};
export default function AIChatPage() {
const router = useRouter();
  // --------------------------------
  // Logout
  // --------------------------------
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error("Logout failed:", error);
        return;
      }

      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "ai",
      text: "Hello 👋 Welcome to Supreme Labs AI. How can I help you today?",
    },
  ]);

  const [loading, setLoading] = useState(false);
const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
const [activeChatId, setActiveChatId] = useState<string | null>(null);
const [copiedCode, setCopiedCode] = useState<string | null>(null);
  // Sidebar open / close
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const chatEndRef = useRef<HTMLDivElement | null>(null);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const requestIdRef = useRef(0);
const createChatId = () => {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

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
// --------------------------------
// Load Chat History
// --------------------------------
// --------------------------------
// Protect AI Chat
// --------------------------------
useEffect(() => {
  const checkUser = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      router.replace("/login");
    }
  };

  checkUser();
}, [router]);
useEffect(() => {
  try {
    const savedHistory = localStorage.getItem("supreme-labs-chat-history");

    if (savedHistory) {
      const parsedHistory = JSON.parse(savedHistory);

      if (Array.isArray(parsedHistory)) {
        setChatHistory(parsedHistory);
      }
    }
  } catch (error) {
    console.error("Failed to load chat history:", error);
  }
}, []);
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // --------------------------------
  // Typing Animation
  // --------------------------------
  const typeReply = (reply: string) => {
    return new Promise<void>((resolve) => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }

      if (!reply) {
        resolve();
        return;
      }

      let currentText = "";
      let characterIndex = 0;

      typingIntervalRef.current = setInterval(() => {
        currentText += reply[characterIndex];
        characterIndex += 1;

        setMessages((prev) => {
          const updated = [...prev];

          if (updated.length > 0) {
            updated[updated.length - 1] = {
              role: "ai",
              text: currentText,
            };
          }

          return updated;
        });

        if (characterIndex >= reply.length) {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }

          resolve();
        }
      }, 18);
    });
  };
// --------------------------------
// Save Chat History
// --------------------------------
const saveChatHistory = (
  chatId: string,
  chatMessages: Message[]
) => {
  const userMessages = chatMessages.filter(
    (msg) => msg.role === "user"
  );

  if (userMessages.length === 0) return;

  const firstMessage = userMessages[0].text.trim();

  const title =
    firstMessage.length > 32
      ? `${firstMessage.slice(0, 32)}...`
      : firstMessage;

  setChatHistory((prev) => {
    const existingChat = prev.find(
      (chat) => chat.id === chatId
    );

    let updatedHistory: ChatHistory[];

    if (existingChat) {
      updatedHistory = prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              title,
              messages: chatMessages,
              updatedAt: Date.now(),
            }
          : chat
      );
    } else {
      updatedHistory = [
        {
          id: chatId,
          title,
          messages: chatMessages,
          updatedAt: Date.now(),
        },
        ...prev,
      ];
    }

    updatedHistory.sort(
      (a, b) => b.updatedAt - a.updatedAt
    );

    localStorage.setItem(
      "supreme-labs-chat-history",
      JSON.stringify(updatedHistory)
    );

    return updatedHistory;
  });
};
  // --------------------------------
  // New Chat
  // --------------------------------
  const newChat = () => {
    requestIdRef.current += 1;

    if (typingIntervalRef.current) {
      clearInterval(typingIntervalRef.current);
      typingIntervalRef.current = null;
    }

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
  // Cleanup typing animation
  // --------------------------------
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, []);
// --------------------------------
// Copy Code
// --------------------------------
const copyCode = async (code: string) => {
  try {
    await navigator.clipboard.writeText(code);

    setCopiedCode(code);

    setTimeout(() => {
      setCopiedCode(null);
    }, 2000);
  } catch (error) {
    console.error("Copy failed:", error);
  }
};
  // --------------------------------
  // Send Message
  // --------------------------------
  const sendMessage = async () => {
    if (!message.trim() || loading) return;

   
   
    const userMessage = message.trim();

const chatId = activeChatId || createChatId();

if (!activeChatId) {
  setActiveChatId(chatId);
}
    const currentRequestId = requestIdRef.current + 1;
    requestIdRef.current = currentRequestId;

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

      if (requestIdRef.current !== currentRequestId) {
        return;
      }

      if (!response.ok) {
        throw new Error(data?.error || "AI response failed");
      }

      const safeReply = makeSafeText(data?.reply);

      if (!safeReply) {
        setMessages((prev) => {
          const updated = [...prev];

          if (updated.length > 0) {
            updated[updated.length - 1] = {
              role: "ai",
              text: "No response received.",
            };
          }

          return updated;
        });

        setLoading(false);
        return;
      }

      await typeReply(safeReply);

if (requestIdRef.current === currentRequestId) {
  setLoading(false);

  setMessages((currentMessages) => {
    saveChatHistory(
      chatId,
      currentMessages
    );

    return currentMessages;
  });
}
    } catch (error) {
      console.error("AI Chat Error:", error);

      if (requestIdRef.current !== currentRequestId) {
        return;
      }

      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }

      setMessages((prev) => {
        const updated = [...prev];

        if (updated.length > 0) {
          updated[updated.length - 1] = {
            role: "ai",
            text: "⚠️ Sorry, AI connection failed.",
          };
        }

        return updated;
      });

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

  <div className="space-y-1 max-h-[55vh] overflow-y-auto pr-1">

    {chatHistory.length === 0 ? (
      <div className="px-3 py-4 rounded-xl bg-white/[0.03] border border-white/5">
        <p className="text-xs text-white/35">
          No recent chats yet.
        </p>

        <p className="text-[11px] text-white/20 mt-1">
          Start a conversation to create chat history.
        </p>
      </div>
    ) : (
      chatHistory.map((chat) => (
        <button
          key={chat.id}
          onClick={() => {
            setActiveChatId(chat.id);
            setMessages(chat.messages);
            setMessage("");
            setLoading(false);
          }}
          className={`
            w-full
            text-left
            rounded-xl
            px-3
            py-3
            transition
            ${
              activeChatId === chat.id
                ? "bg-white/10 border border-white/10"
                : "hover:bg-white/5 border border-transparent"
            }
          `}
        >
          <div className="flex items-center gap-3">

            <span className="text-base shrink-0">
              💬
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm">
                {chat.title}
              </p>

              <p className="text-[11px] text-white/30 mt-0.5">
                {new Date(chat.updatedAt).toLocaleDateString()}
              </p>
            </div>

          </div>
        </button>
      ))
    )}

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
        {/* Logout */}
<div className="mt-auto p-4 border-t border-white/10">
  <button
  onClick={handleLogout}
    className="
      w-full
      flex
      items-center
      gap-3
      rounded-xl
      px-4
      py-3
      text-sm
      text-white/60
      hover:text-white
      hover:bg-red-500/10
      transition
    "
  >
    <span className="text-lg">↪</span>
    <span>Logout</span>
  </button>
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
                        AVATAR
                    ================================== */}

                    {!isUser ? (
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
                          mt-5
                        "
                        aria-label="Supreme Labs AI"
                      >
                        🤖
                      </div>
                    ) : (
                      <div
                        className="
                          shrink-0
                          w-9
                          h-9
                          rounded-xl
                          bg-blue-600
                          border
                          border-blue-400/30
                          flex
                          items-center
                          justify-center
                          text-sm
                          font-semibold
                          shadow-lg
                          mt-5
                          order-2
                        "
                        aria-label="You"
                      >
                        You
                      </div>
                    )}

                    {/* ==================================
                        MESSAGE
                    ================================== */}

                    <div
                      className={`
                        max-w-[88%]
                        md:max-w-[78%]
                        min-w-0
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
                                shadow-sm
                                shadow-black/20
                              `
                              : `
                                bg-white/[0.045]
                                border
                                border-white/[0.08]
                                text-white/90
                                rounded-bl-md
                                shadow-lg
                                shadow-black/10
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
                                components={{
                                  code({
                                    inline,
                                    className,
                                    children,
                                    ...props
                                  }: CodeBlockProps) {
                                    const match = /language-(\w+)/.exec(className || "");
                                    const language = match?.[1]?.toUpperCase() || "CODE";
                                    const codeText = String(children).replace(/\n$/, "");

                                    if (inline) {
                                      return (
                                        <code
                                          className="rounded bg-white/10 px-1.5 py-0.5 text-sm"
                                          {...props}
                                        >
                                          {children}
                                        </code>
                                      );
                                    }

                                    return (
                                      <div className="my-4 overflow-hidden rounded-xl border border-white/10 bg-black/40">
                                        <div className="flex items-center justify-between border-b border-white/10 px-4 py-2">
                                          <span className="text-xs font-medium text-white/60">
                                            {language}
                                          </span>

                                          <button
                                            type="button"
                                            onClick={() => copyCode(codeText)}
                                            className="rounded-md px-3 py-1 text-xs text-white/70 transition hover:bg-white/10 hover:text-white"
                                          >
                                            {copiedCode === codeText ? "✓ Copied" : "Copy"}
                                          </button>
                                        </div>

                                        <pre className="overflow-x-auto p-4 text-sm leading-6">
                                          <code className={className} {...props}>
                                            {children}
                                          </code>
                                        </pre>
                                      </div>
                                    );
                                  },
                                }}
                              >
                                {msg.text}
                              </ReactMarkdown>
                            </div>
                          ) : (
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