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

  // Check if user is near the bottom
  const handleScroll = () => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setIsPinnedToBottom(distanceFromBottom < 80);
  };

  // Automatically scroll while new AI text is streaming
  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container || !isPinnedToBottom) return;

    container.scrollTo({
      top: container.scrollHeight,
      behavior: "auto",
    });
  }, [messages, isPinnedToBottom]);

  // Jump back to the latest message
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

  return (
    <main className="min-h-screen overflow-hidden bg-slate-950 text-white">

      <div className="mx-auto flex h-screen w-full max-w-4xl flex-col overflow-hidden p-4 sm:p-6">

        {/* Header */}
        <header className="border-b border-slate-800 py-6">
          <h1 className="text-2xl font-bold sm:text-3xl">
            Streaming AI Chat
          </h1>

          <p className="mt-1 text-sm text-slate-400">
            FE-06 • Streaming AI Engineering
          </p>
        </header>

        {/* Chat messages area */}
        <section
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="relative min-h-0 flex-1 space-y-4 overflow-y-auto py-6"
        >

          {messages.length === 0 && (
            <div className="mt-20 text-center text-slate-400">
              <p className="text-xl">
                Start a conversation
              </p>

              <p className="mt-2 text-sm">
                Ask the AI assistant anything.
              </p>
            </div>
          )}

          {/* Messages */}
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
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === "user"
                    ? "bg-blue-600"
                    : "bg-slate-800"
                }`}
              >

                <p className="mb-1 text-xs font-semibold opacity-70">
                  {message.role === "user" ? "You" : "AI"}
                </p>

                {message.parts.map((part, index) =>
                  part.type === "text" ? (
                    <p
                      key={index}
                      className="whitespace-pre-wrap leading-6"
                    >
                      {part.text}
                    </p>
                  ) : null
                )}

              </div>
            </div>
          ))}

          {/* Thinking indicator */}
          {status === "submitted" && (
            <div className="text-sm text-slate-400">
              AI is thinking...
            </div>
          )}

          {/* Jump to latest button */}
          {!isPinnedToBottom && (
            <div className="sticky bottom-4 flex justify-center">
              <button
                type="button"
                onClick={jumpToLatest}
                className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold shadow-lg"
              >
                ↓ Jump to latest
              </button>
            </div>
          )}

        </section>

        {/* Message input */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-slate-800 pt-4"
        >

          <div className="flex gap-2">

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={isLoading}
              className="min-w-0 flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 outline-none focus:border-blue-500"
            />

            {isLoading ? (
              <button
                type="button"
                onClick={stop}
                className="rounded-xl bg-red-600 px-5 py-3 font-semibold"
              >
                Stop
              </button>
            ) : (
              <button
                type="submit"
                className="rounded-xl bg-blue-600 px-5 py-3 font-semibold"
              >
                Send
              </button>
            )}

          </div>

        </form>

      </div>

    </main>
  );
}