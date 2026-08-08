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

  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // Convert any API value into a safe string
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

  // Auto Scroll
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages]);

  // New Chat
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

  // Send Message
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

  return (
    <main className="min-h-screen bg-[#09090B] text-white flex">
      {/* Sidebar */}
      <aside className="hidden md:flex w-64 border-r border-white/10 bg-black/20 p-5 flex-col">
        <div>
          <h1 className="text-xl font-bold">Supreme Labs</h1>

          <p className="text-xs text-white/40 mt-1">
            Intelligent Workspace
          </p>
        </div>

        <button
          onClick={newChat}
          className="mt-8 rounded-xl bg-white/10 hover:bg-white/20 py-3 transition"
        >
          + New Chat
        </button>

        <div className="mt-8">
          <p className="text-xs text-white/40 mb-3">
            Recent Chats
          </p>

          <div className="space-y-2 text-sm">
            <div className="rounded-lg bg-white/5 px-3 py-2">
              AI Assistant
            </div>

            <div className="rounded-lg hover:bg-white/5 px-3 py-2">
              Code Helper
            </div>
          </div>
        </div>
      </aside>

      {/* Main Chat Area */}
      <section className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-white/10 flex items-center justify-between px-5 md:px-8">
          <div>
            <h2 className="font-semibold">
              🤖 AI Chat Assistant
            </h2>

            <p className="text-xs text-white/40">
              Supreme Labs Intelligent Workspace
            </p>
          </div>

          <button
            onClick={newChat}
            className="md:hidden rounded-lg bg-white/10 px-3 py-2 text-sm"
          >
            New Chat
          </button>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 ${
                  msg.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                {/* AI Avatar */}
                {msg.role === "ai" && (
                  <div className="w-9 h-9 rounded-full bg-blue-600/20 border border-blue-500/20 flex items-center justify-center shrink-0">
                    🤖
                  </div>
                )}

                {/* Message Bubble */}
                <div
                  className={`max-w-[85%] md:max-w-[75%] rounded-2xl px-5 py-4 ${
                    msg.role === "user"
                      ? "bg-blue-600"
                      : "bg-white/10 border border-white/10"
                  }`}
                >
                  {msg.text ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({ children }) => (
                          <h1 className="text-2xl font-bold mb-3">
                            {children}
                          </h1>
                        ),

                        h2: ({ children }) => (
                          <h2 className="text-xl font-bold mb-3">
                            {children}
                          </h2>
                        ),

                        p: ({ children }) => (
                          <p className="mb-3 last:mb-0 leading-7">
                            {children}
                          </p>
                        ),

                        ul: ({ children }) => (
                          <ul className="list-disc ml-5 mb-3 space-y-1">
                            {children}
                          </ul>
                        ),

                        ol: ({ children }) => (
                          <ol className="list-decimal ml-5 mb-3 space-y-1">
                            {children}
                          </ol>
                        ),

                        li: ({ children }) => (
                          <li>{children}</li>
                        ),

                        strong: ({ children }) => (
                          <strong className="font-bold">
                            {children}
                          </strong>
                        ),

                        code: ({ children }) => (
                          <code className="bg-black/30 rounded px-1.5 py-0.5 text-sm">
                            {String(children)}
                          </code>
                        ),

                        pre: ({ children }) => (
                          <pre className="bg-black/40 rounded-xl p-4 overflow-x-auto my-3">
                            {children}
                          </pre>
                        ),
                      }}
                    >
                      {makeSafeText(msg.text)}
                    </ReactMarkdown>
                  ) : (
                    <span className="animate-pulse">
                      Thinking...
                    </span>
                  )}
                </div>

                {/* User Avatar */}
                {msg.role === "user" && (
                  <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shrink-0">
                    👤
                  </div>
                )}
              </div>
            ))}

            <div ref={chatEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 p-4 md:p-6">
          <div className="max-w-4xl mx-auto flex gap-3">
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              placeholder="Message Supreme Labs AI..."
              className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-5 py-4 outline-none focus:border-blue-500 transition"
            />

            <button
              onClick={sendMessage}
              disabled={loading}
              className="px-6 rounded-2xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 transition font-medium"
            >
              {loading ? "Wait..." : "Send"}
            </button>
          </div>

          <p className="text-center text-xs text-white/30 mt-3">
            Supreme Labs AI can make mistakes. Check important
            information.
          </p>
        </div>
      </section>
    </main>
  );
}