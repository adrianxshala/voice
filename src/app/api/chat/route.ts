import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

export async function POST(req: Request) {
  const { message } = await req.json();

  const result = await streamText({
    model: openai("gpt-4o-mini"),
    messages: [{ role: "user", content: message }],
  });

  return result.toTextStreamResponse();
}
