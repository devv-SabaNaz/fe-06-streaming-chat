"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import ReactMarkdown from "react-markdown";
import { useEffect, useRef, useState } from "react";

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

    setIsPinnedToBottom(distanceFromBottom < 80);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const message = input.trim();

    if (!message || isLoading) return;

    setInput("");
    setIsPinnedToBottom(true);

    sendMessage({
      text: message,
    });
  };

  const handleSuggestion = (question: string) => {
    if (isLoading) return;

    setIsPinnedToBottom(true);

    sendMessage({
      text: question,
    });
  };

  const handleNewChat = () => {
    setMessages([]);
    setInput("");
    setCopiedMessageId(null);
    setIsPinnedToBottom(true);
  };

  const getMessageText = (message: (typeof messages)[number]) => {
    return (
      message.parts
        ?.filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("") ?? ""
    );
  };

  const handleCopy = async (messageId: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedMessageId(messageId);

      setTimeout(() => {
        setCopiedMessageId(null);
      }, 1500);
    } catch {
      // Ignore clipboard errors
    }
  };

  const handleRegenerate = (messageIndex: number) => {
    if (isLoading) return;

    const previousUserMessage = [...messages]
      .slice(0, messageIndex)
      .reverse()
      .find((message) => message.role === "user");

    if (!previousUserMessage) return;

    const text = getMessageText(previousUserMessage);

    setMessages(messages.slice(0, messageIndex));
    setIsPinnedToBottom(true);

    sendMessage({
      text,
    });
  };

  const suggestions = [
    {
      title: "Saba's Skills",
      question: "What skills does Saba have?",
      icon: "⚡",
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

  return (
    <main
      className={`min-h-screen transition-colors duration-300 ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-50 text-slate-900"
      }`}
    >
      {/* Header */}
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-xl ${
          darkMode
            ? "border-slate-800 bg-slate-950/90"
            : "border-slate-200 bg-white/90"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight">
              CareerCraft AI
            </h1>

            <p
              className={`text-xs ${
                darkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              Your AI-powered career companion
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleNewChat}
              className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${
                darkMode
                  ? "border-slate-700 hover:bg-slate-800"
                  : "border-slate-200 hover:bg-slate-100"
              }`}
            >
              New Chat
            </button>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`rounded-xl border px-3 py-2 text-sm transition ${
                darkMode
                  ? "border-slate-700 hover:bg-slate-800"
                  : "border-slate-200 hover:bg-slate-100"
              }`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <section className="mx-auto flex max-w-5xl flex-col px-4 sm:px-6">
        {/* Welcome */}
        {messages.length === 0 && (
          <div className="flex min-h-[calc(100vh-150px)] flex-col items-center justify-center py-12">
            <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-3xl shadow-lg">
              ✨
            </div>

            <div className="mb-3 rounded-full border border-violet-200 bg-violet-50 px-4 py-1.5 text-xs font-semibold text-violet-700 dark:border-violet-900 dark:bg-violet-950 dark:text-violet-300">
              AI Career Assistant
            </div>

            <h2 className="text-center text-3xl font-bold tracking-tight sm:text-5xl">
              Hi, I'm CareerCraft AI
            </h2>

            <p
              className={`mt-4 max-w-2xl text-center text-sm leading-6 sm:text-base ${
                darkMode ? "text-slate-400" : "text-slate-600"
              }`}
            >
              Ask me about Saba Naz's skills, projects, education,
              frontend development, or Frontend AI Engineering journey.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {["Frontend", "AI Engineering", "Next.js", "Gemini"].map(
                (tag) => (
                  <span
                    key={tag}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      darkMode
                        ? "bg-slate-800 text-slate-300"
                        : "bg-white text-slate-600 shadow-sm"
                    }`}
                  >
                    {tag}
                  </span>
                )
              )}
            </div>

            <div className="mt-10 grid w-full max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2">
              {suggestions.map((item) => (
                <button
                  key={item.title}
                  onClick={() => handleSuggestion(item.question)}
                  disabled={isLoading}
                  className={`rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 ${
                    darkMode
                      ? "border-slate-800 bg-slate-900 hover:border-violet-700"
                      : "border-slate-200 bg-white hover:border-violet-300 hover:shadow-md"
                  }`}
                >
                  <div className="mb-2 text-xl">{item.icon}</div>

                  <div className="font-semibold">{item.title}</div>

                  <div
                    className={`mt-1 text-sm ${
                      darkMode ? "text-slate-400" : "text-slate-500"
                    }`}
                  >
                    {item.question}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        {messages.length > 0 && (
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="h-[calc(100vh-220px)] overflow-y-auto py-8"
          >
            <div className="mx-auto max-w-4xl space-y-6">
              {messages.map((message, index) => {
                const text = getMessageText(message);
                const isUser = message.role === "user";

                return (
                  <div
                    key={message.id}
                    className={`flex ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[90%] rounded-2xl px-5 py-4 sm:max-w-[80%] ${
                        isUser
                          ? "bg-violet-600 text-white"
                          : darkMode
                          ? "border border-slate-800 bg-slate-900"
                          : "border border-slate-200 bg-white shadow-sm"
                      }`}
                    >
                      {!isUser && (
                        <div className="mb-2 text-xs font-semibold text-violet-600">
                          CareerCraft AI
                        </div>
                      )}

                      {text ? (
                        isUser ? (
                          <div className="whitespace-pre-wrap text-sm leading-6">
                            {text}
                          </div>
                        ) : (
                          <div className="text-sm leading-6">
                            <ReactMarkdown
                              components={{
                                h2: ({ children }) => (
                                  <h2 className="mb-3 mt-2 text-lg font-bold">
                                    {children}
                                  </h2>
                                ),

                                h3: ({ children }) => (
                                  <h3 className="mb-2 mt-4 font-semibold">
                                    {children}
                                  </h3>
                                ),

                                p: ({ children }) => (
                                  <p className="mb-3 last:mb-0">
                                    {children}
                                  </p>
                                ),

                                ul: ({ children }) => (
                                  <ul className="mb-3 ml-5 list-disc space-y-1">
                                    {children}
                                  </ul>
                                ),

                                ol: ({ children }) => (
                                  <ol className="mb-3 ml-5 list-decimal space-y-1">
                                    {children}
                                  </ol>
                                ),

                                li: ({ children }) => (
                                  <li className="pl-1">{children}</li>
                                ),

                                strong: ({ children }) => (
                                  <strong className="font-semibold">
                                    {children}
                                  </strong>
                                ),

                                a: ({ children, ...props }) => (
                                  <a
                                    {...props}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-violet-600 underline"
                                  >
                                    {children}
                                  </a>
                                ),
                              }}
                            >
                              {text}
                            </ReactMarkdown>
                          </div>
                        )
                      ) : (
                        isLoading &&
                        index === messages.length - 1 && (
                          <div className="flex items-center gap-1">
                            <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500" />
                            <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:0.15s]" />
                            <span className="h-2 w-2 animate-bounce rounded-full bg-violet-500 [animation-delay:0.3s]" />
                          </div>
                        )
                      )}

                      {!isUser && text && !isLoading && (
                        <div className="mt-4 flex items-center gap-3 border-t border-slate-200 pt-3 text-xs dark:border-slate-800">
                          <button
                            onClick={() =>
                              handleCopy(message.id, text)
                            }
                            className="text-slate-500 transition hover:text-violet-600"
                          >
                            {copiedMessageId === message.id
                              ? "✓ Copied"
                              : "📋 Copy"}
                          </button>

                          <button
                            onClick={() =>
                              handleRegenerate(index)
                            }
                            className="text-slate-500 transition hover:text-violet-600"
                          >
                            🔄 Regenerate
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Input */}
        <div className="sticky bottom-0 py-4">
          <form
            onSubmit={handleSubmit}
            className={`mx-auto flex max-w-4xl items-center gap-2 rounded-2xl border p-2 shadow-lg ${
              darkMode
                ? "border-slate-800 bg-slate-900"
                : "border-slate-200 bg-white"
            }`}
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask CareerCraft AI about Saba..."
              disabled={isLoading}
              className={`min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none ${
                darkMode
                  ? "placeholder:text-slate-500"
                  : "placeholder:text-slate-400"
              }`}
            />

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "..." : "Send"}
            </button>
          </form>

          <div
            className={`mt-3 flex items-center justify-center gap-2 text-xs ${
              darkMode ? "text-slate-500" : "text-slate-400"
            }`}
          >
            <span className="h-2 w-2 rounded-full bg-green-500" />
            AI Online
          </div>

          <p
            className={`mt-2 text-center text-xs ${
              darkMode ? "text-slate-600" : "text-slate-400"
            }`}
          >
            CareerCraft AI focuses on Saba Naz's professional portfolio
            and career information.
          </p>
        </div>
      </section>
    </main>
  );
}
