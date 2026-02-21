import { NextRequest } from "next/server";
import { ai, MODEL } from "@/lib/gemini";
import { SYSTEM_PROMPT, buildLeaseContext } from "@/lib/prompts";
import { getExtractedText } from "@/lib/storage";
import type { ChatRequest } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, documentId, history, location } = body;

    let systemInstruction = SYSTEM_PROMPT;

    if (documentId) {
      const leaseText = await getExtractedText(documentId);
      if (leaseText) {
        systemInstruction += buildLeaseContext(leaseText);
      }
    }

    if (location?.city || location?.state) {
      systemInstruction += `\n\nThe user is located in ${location.city ? location.city + ", " : ""}${location.state || "unknown state"}.`;
    }

    // Build full contents array: conversation history + new user message
    const contents = [
      ...history.map((entry) => ({
        role: entry.role,
        parts: entry.parts,
      })),
      { role: "user" as const, parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContentStream({
      model: MODEL,
      config: {
        systemInstruction: systemInstruction,
      },
      contents,
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of response) {
            const text = chunk.text;
            if (text) {
              controller.enqueue(encoder.encode(text));
            }
          }
          controller.close();
        } catch (err) {
          console.error("Stream error:", err);
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "Cache-Control": "no-cache",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return new Response(JSON.stringify({ error: "Chat request failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
