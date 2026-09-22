"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [input, setInput] = useState("");
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, stop } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading =
    status === "submitted" || status === "streaming";

  // Check whether the user is near the bottom
  const handleScroll = () => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setIsPinnedToBottom(distanceFromBottom < 80);
  };

  // Automatically scroll during streaming
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container || !isPinnedToBottom) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "auto",
    });
  }, [messages, isPinnedToBottom]);

  // Jump to latest message
  const jumpToLatest = () => {
    const container = messagesContainerRef.current;

    if (!container) return;

    setIsPinnedToBottom(true);

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "smooth",
    });
  };

  // Send message
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    sendMessage({
      text: input,
    });

    setInput("");
    setIsPinnedToBottom(true);
  };

  // Suggested prompts
  const suggestedPrompts = [
    "Tell me about Saba",
    "What are Saba's technical skills?",
    "Show me Saba's projects",
    "Tell me about Saba's internship",
  ];

  const handleSuggestion = (prompt: string) => {
    if (isLoading) return;

    sendMessage({
      text: prompt,
    });

    setIsPinnedToBottom(true);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-white">

      <div className="mx-auto flex h-screen w-full max-w-5xl flex-col px-4 sm:px-6">

        {/* Header */}
        <header className="border-b border-slate-800 py-5">

          <div className="flex items-center justify-between gap-4">

            <div>
              <div className="flex items-center gap-3">

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold shadow-lg shadow-blue-600/20">
                  AI
                </div>

                <div>
                  <h1 className="text-xl font-bold sm:text-2xl">
                    Saba&apos;s AI Assistant
                  </h1>

                  <p className="text-xs text-slate-400 sm:text-sm">
                    Portfolio & Career Assistant
                  </p>
                </div>

              </div>
            </div>

            {/* Online status */}
            <div className="hidden items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-2 text-xs text-slate-400 sm:flex">

              <span className="h-2 w-2 rounded-full bg-green-500" />

              AI Online

            </div>

          </div>

        </header>

        {/* Chat area */}
        <section
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="relative min-h-0 flex-1 overflow-y-auto py-6"
        >

          {/* Empty state */}
          {messages.length === 0 && (
            <div className="mx-auto flex max-w-2xl flex-col items-center pt-10 text-center sm:pt-16">

              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600/10 text-2xl ring-1 ring-blue-500/20">
                ✨
              </div>

              <h2 className="text-2xl font-bold sm:text-3xl">
                Welcome to Saba&apos;s AI Assistant
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-base">
                Ask me about Saba&apos;s skills, projects, frontend
                development experience, internship, or portfolio.
              </p>

              {/* Suggested prompts */}
              <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">

                {suggestedPrompts.map((prompt) => (
                  <button
                    key={prompt}
                    type="button"
                    onClick={() => handleSuggestion(prompt)}
                    className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-left text-sm text-slate-300 transition hover:border-blue-500 hover:bg-slate-800 hover:text-white"
                  >
                    <span className="mb-2 block text-blue-400">
                      →
                    </span>

                    {prompt}
                  </button>
                ))}

              </div>

            </div>
          )}

          {/* Messages */}
          <div className="space-y-5">

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user"
                    ? "justify-end"
                    : "justify-start"
                }`}
              >

                <div
                  className={`max-w-[90%] rounded-2xl px-4 py-3 sm:max-w-[75%] ${
                    message.role === "user"
                      ? "bg-blue-600 text-white"
                      : "border border-slate-800 bg-slate-900 text-slate-200"
                  }`}
                >

                  <p className="mb-1 text-xs font-semibold opacity-60">
                    {message.role === "user"
                      ? "You"
                      : "Saba's AI Assistant"}
                  </p>

                  {message.parts.map((part, index) =>
                    part.type === "text" ? (
                      <p
                        key={index}
                        className="whitespace-pre-wrap text-sm leading-7 sm:text-base"
                      >
                        {part.text}
                      </p>
                    ) : null
                  )}

                </div>

              </div>
            ))}

          </div>

          {/* Thinking indicator */}
          {status === "submitted" && (
            <div className="mt-4 flex items-center gap-3 text-sm text-slate-400">

              <div className="flex gap-1">

                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />

                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:150ms]" />

                <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500 [animation-delay:300ms]" />

              </div>

              AI is thinking...

            </div>
          )}

          {/* Jump to latest */}
          {!isPinnedToBottom && (
            <div className="sticky bottom-4 flex justify-center">

              <button
                type="button"
                onClick={jumpToLatest}
                className="rounded-full border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold shadow-xl transition hover:border-blue-500 hover:bg-slate-800"
              >
                ↓ Jump to latest
              </button>

            </div>
          )}

        </section>

        {/* Input */}
        <div className="border-t border-slate-800 py-4">

          <form onSubmit={handleSubmit}>

            <div className="flex gap-2 rounded-2xl border border-slate-700 bg-slate-900 p-2 transition focus-within:border-blue-500">

              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about Saba's skills, projects, or experience..."
                disabled={isLoading}
                className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-500 sm:text-base"
              />

              {isLoading ? (
                <button
                  type="button"
                  onClick={stop}
                  className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold transition hover:bg-red-500 sm:px-5"
                >
                  Stop
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={!input.trim()}
                  className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40 sm:px-5"
                >
                  Send
                </button>
              )}

            </div>

            <p className="mt-2 text-center text-xs text-slate-600">
              Powered by Next.js, AI SDK & Gemini
            </p>

          </form>

        </div>

      </div>

    </main>
  );
}
