import { google } from "@ai-sdk/google";
import { streamText, convertToModelMessages, UIMessage } from "ai";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages }: { messages: UIMessage[] } = await req.json();

  const result = streamText({
    model: google("gemini-3.6-flash"),
    system:
      "You are a helpful AI assistant. Give clear, concise and friendly answers.",
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}