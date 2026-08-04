"use client";

import { useState } from "react";
export default function AIChatPage() {
const [message, setMessage] = useState("");
const [reply, setReply] = useState("");
const [loading, setLoading] = useState(false);
const sendMessage = async () => {
  if (!message.trim()) return;

  try {
    setLoading(true);

    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
      }),
    });

    const data = await response.json();

    setReply(data.reply);
    setMessage("");

  } catch (error) {
    console.error(error);
    setReply("Something went wrong. Please try again.");
  } finally {
    setLoading(false);
  }
};
return (
    <main className="min-h-screen bg-[#09090B] text-white">

      {/* Header */}
      <header className="border-b border-zinc-800 bg-[#09090B]/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">

          <div>
            <h1 className="text-2xl font-bold">
              🤖 AI Chat Assistant
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              Supreme Labs Intelligent Workspace
            </p>
          </div>

          <button className="rounded-xl border border-zinc-700 px-4 py-2 transition hover:border-blue-500 hover:bg-zinc-800">
            New Chat
          </button>

        </div>
      </header>

      {/* Chat Container */}
      <section className="mx-auto flex h-[calc(100vh-82px)] max-w-6xl flex-col px-6 py-6">

        {/* Welcome Card */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-8">

          <div className="text-center">

            <div className="text-6xl">
              🤖
            </div>

            <h2 className="mt-5 text-3xl font-bold">
              Welcome to AI Chat Assistant
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-400">
              Ask anything. Generate content, solve coding problems,
              brainstorm ideas, summarize documents and boost your
              productivity with AI.
            </p>

          </div>

        </div>

        {/* Messages */}
        <div className="mt-6 flex-1 overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-900/40 p-6">

          <div className="flex gap-4">

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-600">
              🤖
            </div>

            <div className="max-w-2xl rounded-2xl bg-zinc-800 p-5">

              <h3 className="font-semibold">
                Supreme Labs AI
              </h3>

              <p className="mt-2 text-gray-300">
                Hello 👋

                I'm your AI assistant.

                How can I help you today?
              </p>
              {reply && (
  <p className="mt-4 text-gray-300">
    {reply}
  </p>
)}

            </div>

          </div>

        </div>
                {/* Input Area */}
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">

          <div className="flex items-center gap-3">

            <input
  type="text"
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  placeholder="Ask anything..."
  className="flex-1 rounded-xl border border-zinc-700 bg-[#09090B] px-5 py-4 text-white outline-none transition focus:border-blue-500"
/>

            <button
  onClick={sendMessage}
  disabled={loading}
  className="rounded-xl bg-blue-600 px-8 py-4 font-semibold transition hover:bg-blue-700 disabled:opacity-50"
>
  {loading ? "Thinking..." : "Send"}
</button>

          </div>

          <p className="mt-3 text-center text-xs text-gray-500">
            AI responses may occasionally make mistakes. Please verify important information.
          </p>

        </div>

      </section>

    </main>
  );
}