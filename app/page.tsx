"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
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
  const [darkMode, setDarkMode] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const { messages, sendMessage, status, setMessages } = useChat({
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

  const handleNewChat = () => {
    if (isLoading) return;

    setMessages([]);
    setInput("");
    setCopiedMessageId(null);
    setIsPinnedToBottom(true);
  };

  const handleCopy = async (messageId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);

      setCopiedMessageId(messageId);

      setTimeout(() => {
        setCopiedMessageId(null);
      }, 1500);
    } catch (error) {
      console.error("Copy failed:", error);
    }
  };

  const handleRegenerate = async (messageId: string) => {
    if (isLoading) return;

    const messageIndex = messages.findIndex(
      (message) => message.id === messageId
    );

    if (messageIndex === -1) return;

    const previousUserMessage = [...messages]
      .slice(0, messageIndex)
      .reverse()
      .find((message) => message.role === "user");

    if (!previousUserMessage) return;

    const text = previousUserMessage.parts
      ?.filter((part) => part.type === "text")
      .map((part) => part.text)
      .join(" ");

    if (!text) return;

    setMessages(messages.slice(0, messageIndex));

    await sendMessage({
      text,
    });
  };

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-[#f7f8fc] text-slate-900"
      }`}
    >
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 py-4 sm:px-6 lg:px-8">
        {/* Header */}
        <header
          className={`flex items-center justify-between border-b pb-4 ${
            darkMode ? "border-slate-800" : "border-slate-200"
          }`}
        >
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
              CareerCraft AI
            </h1>

            <p
              className={`text-xs sm:text-sm ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Your AI-powered career companion
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* New Chat */}
            <button
              type="button"
              onClick={handleNewChat}
              disabled={isLoading || messages.length === 0}
              className={`rounded-xl border px-3 py-2 text-xs font-medium transition ${
                darkMode
                  ? "border-slate-700 bg-slate-900 hover:bg-slate-800"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              } disabled:cursor-not-allowed disabled:opacity-40`}
            >
              + New Chat
            </button>

            {/* Dark Mode */}
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`rounded-xl border px-3 py-2 text-sm transition ${
                darkMode
                  ? "border-slate-700 bg-slate-900 hover:bg-slate-800"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>

            {/* AI Status */}
            <div
              className={`hidden items-center gap-2 rounded-full border px-3 py-1.5 sm:flex ${
                darkMode
                  ? "border-slate-700 bg-slate-900"
                  : "border-slate-200 bg-white"
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-500" />

              <span
                className={`text-xs font-medium ${
                  darkMode ? "text-slate-300" : "text-slate-600"
                }`}
              >
                AI Online
              </span>
            </div>
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
              {/* Welcome Hero */}
              <div className="mb-10 mt-4 text-center sm:mt-8">
                {/* AI Badge */}
                <div
                  className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${
                    darkMode
                      ? "border-slate-800 bg-slate-900 text-slate-300"
                      : "border-slate-200 bg-white text-slate-600"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-emerald-500" />
                  AI Career Assistant
                </div>

                {/* Icon */}
                <div
                  className={`mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-3xl text-4xl shadow-xl ${
                    darkMode
                      ? "bg-white text-slate-900 shadow-black/20"
                      : "bg-slate-900 text-white shadow-slate-300/40"
                  }`}
                >
                  ✨
                </div>

                <h2 className="text-3xl font-bold tracking-tight sm:text-5xl">
                  Hi, I&apos;m CareerCraft AI
                </h2>

                <p
                  className={`mx-auto mt-4 max-w-2xl text-sm leading-7 sm:text-base ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  Explore Saba&apos;s skills, education, projects, and
                  Frontend AI Engineering journey through an AI-powered
                  conversation.
                </p>

                {/* Skill Tags */}
                <div
                  className={`mx-auto mt-5 flex max-w-xl flex-wrap justify-center gap-2 text-xs ${
                    darkMode ? "text-slate-400" : "text-slate-500"
                  }`}
                >
                  <span
                    className={`rounded-full border px-3 py-1.5 ${
                      darkMode
                        ? "border-slate-800 bg-slate-900"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    Frontend
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1.5 ${
                      darkMode
                        ? "border-slate-800 bg-slate-900"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    AI Engineering
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1.5 ${
                      darkMode
                        ? "border-slate-800 bg-slate-900"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    Next.js
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1.5 ${
                      darkMode
                        ? "border-slate-800 bg-slate-900"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    Gemini
                  </span>
                </div>
              </div>

              {/* Suggestions */}
              <div className="w-full">
                <div className="mb-4">
                  <h3 className="text-sm font-semibold">
                    Explore Saba&apos;s profile
                  </h3>

                  <p
                    className={`mt-1 text-xs ${
                      darkMode ? "text-slate-500" : "text-slate-400"
                    }`}
                  >
                    Choose a topic to start the conversation.
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.question}
                      type="button"
                      onClick={() =>
                        handleSuggestion(suggestion.question)
                      }
                      disabled={isLoading}
                      className={`group rounded-2xl border p-5 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-60 ${
                        darkMode
                          ? "border-slate-800 bg-slate-900 hover:border-slate-700"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      }`}
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <span
                          className={`flex h-11 w-11 items-center justify-center rounded-xl text-xl ${
                            darkMode
                              ? "bg-slate-800"
                              : "bg-slate-100"
                          }`}
                        >
                          {suggestion.icon}
                        </span>

                        <span
                          className={`text-lg transition duration-200 group-hover:translate-x-1 ${
                            darkMode
                              ? "text-slate-600 group-hover:text-white"
                              : "text-slate-300 group-hover:text-slate-700"
                          }`}
                        >
                          →
                        </span>
                      </div>

                      <h3 className="font-semibold">
                        {suggestion.title}
                      </h3>

                      <p
                        className={`mt-1 text-sm leading-5 ${
                          darkMode
                            ? "text-slate-400"
                            : "text-slate-500"
                        }`}
                      >
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

                const messageText = message.parts
                  ?.filter((part) => part.type === "text")
                  .map((part) => part.text)
                  .join("");

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
                          ? darkMode
                            ? "rounded-br-md bg-white text-slate-900"
                            : "rounded-br-md bg-slate-900 text-white"
                          : darkMode
                          ? "rounded-bl-md border border-slate-800 bg-slate-900 text-slate-100"
                          : "rounded-bl-md border border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      {/* AI Label */}
                      {!isUser && (
                        <div
                          className={`mb-2 text-xs font-bold uppercase tracking-wide ${
                            darkMode
                              ? "text-slate-500"
                              : "text-slate-400"
                          }`}
                        >
                          CareerCraft AI
                        </div>
                      )}

                      {/* Markdown */}
                      <div className="text-sm leading-6">
                        <ReactMarkdown
                          components={{
                            h1: ({ children }) => (
                              <h1 className="mb-3 mt-1 text-xl font-bold">
                                {children}
                              </h1>
                            ),

                            h2: ({ children }) => (
                              <h2 className="mb-3 mt-4 text-lg font-bold">
                                {children}
                              </h2>
                            ),

                            h3: ({ children }) => (
                              <h3 className="mb-2 mt-4 text-base font-bold">
                                {children}
                              </h3>
                            ),

                            p: ({ children }) => (
                              <p className="mb-3 last:mb-0">
                                {children}
                              </p>
                            ),

                            ul: ({ children }) => (
                              <ul className="mb-3 list-disc space-y-1 pl-5">
                                {children}
                              </ul>
                            ),

                            ol: ({ children }) => (
                              <ol className="mb-3 list-decimal space-y-1 pl-5">
                                {children}
                              </ol>
                            ),

                            li: ({ children }) => (
                              <li>{children}</li>
                            ),

                            strong: ({ children }) => (
                              <strong className="font-semibold">
                                {children}
                              </strong>
                            ),

                            a: ({ href, children }) => (
                              <a
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                              >
                                {children}
                              </a>
                            ),
                          }}
                        >
                          {messageText}
                        </ReactMarkdown>
                      </div>

                      {/* AI Actions */}
                      {!isUser && messageText && (
                        <div
                          className={`mt-3 flex items-center gap-2 border-t pt-2 ${
                            darkMode
                              ? "border-slate-800"
                              : "border-slate-100"
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() =>
                              handleCopy(message.id, messageText)
                            }
                            className={`rounded-lg px-2 py-1 text-xs transition ${
                              darkMode
                                ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            }`}
                          >
                            {copiedMessageId === message.id
                              ? "✓ Copied"
                              : "📋 Copy"}
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleRegenerate(message.id)
                            }
                            disabled={isLoading}
                            className={`rounded-lg px-2 py-1 text-xs transition ${
                              darkMode
                                ? "text-slate-400 hover:bg-slate-800 hover:text-white"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                            } disabled:opacity-40`}
                          >
                            🔄 Regenerate
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Loading */}
              {status === "submitted" && (
                <div className="flex justify-start">
                  <div
                    className={`rounded-2xl rounded-bl-md border px-4 py-3 shadow-sm ${
                      darkMode
                        ? "border-slate-800 bg-slate-900"
                        : "border-slate-200 bg-white"
                    }`}
                  >
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
            className={`rounded-2xl border p-2 shadow-lg transition ${
              darkMode
                ? "border-slate-800 bg-slate-900 shadow-black/20"
                : "border-slate-200 bg-white shadow-slate-200/50"
            }`}
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
                className={`max-h-32 min-h-12 flex-1 resize-none bg-transparent px-3 py-3 text-sm outline-none placeholder:text-slate-400 ${
                  darkMode ? "text-white" : "text-slate-800"
                }`}
              />

              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className={`rounded-xl px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${
                  darkMode
                    ? "bg-white text-slate-900 hover:bg-slate-200"
                    : "bg-slate-900 text-white hover:bg-slate-700"
                }`}
              >
                {isLoading ? "..." : "Send"}
              </button>
            </div>

            <div
              className={`px-3 pb-1 pt-1 text-xs ${
                darkMode ? "text-slate-500" : "text-slate-400"
              }`}
            >
              Press Enter to send • Shift + Enter for a new line
            </div>
          </form>

          <p
            className={`mt-2 text-center text-[11px] ${
              darkMode ? "text-slate-600" : "text-slate-400"
            }`}
          >
            CareerCraft AI provides information based on Saba&apos;s
            portfolio.
          </p>
        </div>
      </div>
    </main>
  );
}
