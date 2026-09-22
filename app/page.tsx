"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useRef, useState } from "react";

const suggestions = [
  {
    title: "Saba's Skills",
    question: "What skills does Saba have?",
    icon: "💻",
  },
  {
    title: "Her Projects",
    question: "Tell me about Saba's projects.",
    icon: "🚀",
  },
  {
    title: "Education",
    question: "What is Saba studying?",
    icon: "🎓",
  },
  {
    title: "AI Experience",
    question: "What AI projects has Saba built?",
    icon: "🤖",
  },
];

export default function Home() {
  const [input, setInput] = useState("");
  const [isPinnedToBottom, setIsPinnedToBottom] = useState(true);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({
      api: "/api/chat",
    }),
  });

  const isLoading = status === "submitted" || status === "streaming";

  useEffect(() => {
    const container = messagesContainerRef.current;

    if (!container || !isPinnedToBottom) return;

    container.scrollTop = container.scrollHeight;
  }, [messages, isPinnedToBottom]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;

    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight -
      container.scrollTop -
      container.clientHeight;

    setIsPinnedToBottom(distanceFromBottom < 100);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const message = input.trim();

    setInput("");
    setIsPinnedToBottom(true);

    await sendMessage({
      text: message,
    });
  };

  const handleSuggestion = async (question: string) => {
    if (isLoading) return;

    setIsPinnedToBottom(true);

    await sendMessage({
      text: question,
    });
  };

  return (
    <main className="min-h-screen bg-[#f7f8fc] text-slate-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
              CareerCraft AI
            </h1>

            <p className="text-xs text-slate-500 sm:text-sm">
              Your AI-powered career companion
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1.5 shadow-sm">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-medium text-slate-600">
              AI Online
            </span>
          </div>
        </header>

        {/* Chat Area */}
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="flex-1 overflow-y-auto py-8"
        >
          {messages.length === 0 ? (
            <section className="mx-auto flex max-w-4xl flex-col items-center">
              {/* Hero */}
              <div className="mb-8 text-center">
                <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-900 text-3xl shadow-lg">
                  ✨
                </div>

                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Meet CareerCraft AI
                </h2>

                <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
                  Explore Saba&apos;s skills, education, projects, and
                  frontend AI engineering journey through an AI-powered
                  conversation.
                </p>
              </div>

              {/* Suggestions */}
              <div className="w-full">
                <p className="mb-3 text-sm font-semibold text-slate-700">
                  Try asking:
                </p>

                <div className="grid gap-3 sm:grid-cols-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.question}
                      type="button"
                      onClick={() => handleSuggestion(suggestion.question)}
                      disabled={isLoading}
                      className="group rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <span className="text-2xl">
                          {suggestion.icon}
                        </span>

                        <span className="text-slate-300 transition group-hover:text-slate-600">
                          →
                        </span>
                      </div>

                      <h3 className="font-semibold text-slate-800">
                        {suggestion.title}
                      </h3>

                      <p className="mt-1 text-sm leading-5 text-slate-500">
                        {suggestion.question}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </section>
          ) : (
            <section className="mx-auto flex max-w-4xl flex-col gap-5">
              {messages.map((message) => {
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[88%] rounded-2xl px-4 py-3 shadow-sm ${
                        isUser
                          ? "rounded-br-md bg-slate-900 text-white"
                          : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      {!isUser && (
                        <div className="mb-2 text-xs font-bold uppercase tracking-wide text-slate-400">
                          CareerCraft AI
                        </div>
                      )}

                      <div className="whitespace-pre-wrap text-sm leading-6">
                        {message.parts?.map((part, index) => {
                          if (part.type === "text") {
                            return (
                              <span key={index}>
                                {part.text}
                              </span>
                            );
                          }

                          return null;
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}

              {status === "submitted" && (
                <div className="flex justify-start">
                  <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:150ms]" />
                      <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:300ms]" />
                    </div>
                  </div>
                </div>
              )}
            </section>
          )}
        </div>

        {/* Input */}
        <div className="mx-auto w-full max-w-4xl pb-2">
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50"
          >
            <div className="flex items-end gap-2">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Ask CareerCraft AI anything..."
                rows={1}
                disabled={isLoading}
                className="max-h-32 min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400 disabled:cursor-not-allowed"
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>

            <div className="px-3 pb-1 pt-1 text-xs text-slate-400">
              Press Enter to send • Shift + Enter for a new line
            </div>
          </form>

          <p className="mt-2 text-center text-[11px] text-slate-400">
            CareerCraft AI provides information based on Saba&apos;s
            portfolio.
          </p>
        </div>
      </div>
    </main>
  );
}
