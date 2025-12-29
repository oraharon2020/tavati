import { anthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";
import { SYSTEM_PROMPT } from "@/lib/prompts";

export const maxDuration = 30;

interface MessageContent {
  role: string;
  content: string;
  images?: string[]; // base64 data URLs
}

export async function POST(req: Request) {
  const { messages } = await req.json();

  // Convert messages to the format expected by the AI SDK
  const formattedMessages = messages
    .filter((m: MessageContent) => m.content && m.content.trim() !== "")
    .map((m: MessageContent) => {
      // If message has images, create multimodal content
      if (m.images && m.images.length > 0) {
        const contentParts: Array<{ type: string; text?: string; image?: string }> = [];
        
        // Add images first
        for (const imageUrl of m.images) {
          if (imageUrl.startsWith("data:")) {
            contentParts.push({
              type: "image",
              image: imageUrl,
            });
          }
        }
        
        // Add text
        contentParts.push({
          type: "text",
          text: m.content,
        });
        
        return {
          role: m.role,
          content: contentParts,
        };
      }
      
      // Regular text message
      return {
        role: m.role,
        content: m.content,
      };
    });

  const result = streamText({
    model: anthropic("claude-haiku-4-5-20251001"),
    system: SYSTEM_PROMPT,
    messages: formattedMessages,
    temperature: 0.7,
  });

  return result.toTextStreamResponse();
}
