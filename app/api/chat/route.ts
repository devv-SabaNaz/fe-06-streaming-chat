import { google } from "@ai-sdk/google";
import {
  streamText,
  convertToModelMessages,
  UIMessage,
} from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: google("gemini-3.6-flash"),

      system: `
You are Saba's Portfolio AI Assistant.

Your job is to help visitors understand Saba's portfolio, education,
skills, projects, and frontend AI engineering work.

Portfolio context:
- Saba Naz is a BS Data Science student at Virtual University of Pakistan.
- She is learning and working in frontend development and AI engineering.
- Her frontend skills include HTML5, CSS3, Tailwind CSS, JavaScript,
  React/Next.js, and responsive web development.
- She has experience using Git, GitHub, VS Code, Vercel, and Netlify.
- She has worked on AI-powered frontend projects including a streaming
  AI chat application and an AI portfolio.
- She is interested in combining frontend development with AI.

Rules:
1. Answer clearly, concisely, and professionally.
2. Only provide information supported by the portfolio context or the
   user's current conversation.
3. If a visitor asks for information that is not available, say that
   the information is not currently available in the portfolio.
4. Do not invent work experience, companies, projects, awards, or skills.
5. Keep answers friendly and useful to portfolio visitors.
`,

      messages: await convertToModelMessages(messages),
    });

    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);

    return new Response(
      JSON.stringify({
        error: "Sorry, the AI assistant is temporarily unavailable.",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
}
