# Streaming AI Portfolio Assistant

A production-ready AI-powered chat application built with Next.js and Google Gemini. The assistant helps portfolio visitors learn about Saba's skills, education, projects, and frontend AI engineering work through a streaming conversation.

## Project Overview

The problem this project solves is that portfolio visitors may want quick answers about a developer's skills, projects, and background without searching through multiple sections of a portfolio. This project provides a conversational AI assistant that answers portfolio-related questions clearly and naturally. I chose this idea because it combines frontend development with a meaningful AI feature and gives visitors a faster way to explore portfolio information.

## Live Demo

https://fe-06-streaming-chat-zeta.vercel.app/

## GitHub Repository

https://github.com/devv-SabaNaz/fe-06-streaming-chat

## Features

- Streaming AI responses
- Portfolio-focused AI assistant
- User and AI message separation
- Auto-scroll while responses are streaming
- Jump-to-latest button
- Loading/thinking state
- Stop generation button
- Empty conversation state
- Disabled input while a response is being generated
- Responsive interface
- Server-side AI API route
- Error handling for API failures

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Vercel
- Vercel AI SDK
- Google Gemini

## AI Integration

The application uses the Vercel AI SDK with Google's Gemini model.

The AI request is handled through:

`app/api/chat/route.ts`

The application uses `streamText()` to generate the response as a stream instead of waiting for the complete answer before displaying it.

The AI is given portfolio-specific instructions so that it acts as a portfolio assistant rather than a generic chatbot.

The assistant is instructed to:

- Answer questions about Saba's portfolio
- Explain her skills and education
- Discuss her frontend and AI projects
- Give clear and concise answers
- Avoid inventing information
- Tell the visitor when information is not available

## Architecture

The main application is divided into two parts:

### Frontend

`app/page.tsx`

The frontend provides the chat interface. It manages:

- User input
- Conversation messages
- Loading state
- Streaming responses
- Auto-scrolling
- Stop generation
- Jump-to-latest behavior

### AI API

`app/api/chat/route.ts`

The API route:

1. Receives the conversation messages.
2. Converts the messages into the model format.
3. Sends them to Google Gemini through the AI SDK.
4. Streams the generated response back to the frontend.
5. Returns a controlled error response if the AI request fails.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/devv-SabaNaz/fe-06-streaming-chat.git
cd fe-06-streaming-chat
