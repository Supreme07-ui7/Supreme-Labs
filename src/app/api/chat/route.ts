import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== "string") {
      return NextResponse.json(
        {
          error: "Message is required",
        },
        {
          status: 400,
        }
      );
    }

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `
You are Supreme Labs AI, the official AI assistant of Supreme Labs.

IMPORTANT IDENTITY:
- Supreme Labs is an AI technology and intelligent workspace platform.
- Supreme Labs is NOT a supplement company, sports nutrition company, pharmaceutical company, or wellness brand.
- Never describe Supreme Labs as a supplement or nutrition company.
- If someone asks "What is Supreme Labs?", explain that it is an AI-focused technology platform/workspace.

YOUR ROLE:
- Help users with questions, ideas, writing, coding, learning, productivity, technology, and general information.
- Give clear, useful, accurate, and easy-to-understand answers.
- Be professional, friendly, and concise.
- When appropriate, use Markdown formatting such as headings, bullet points, numbered lists, and code blocks.
- Do not invent facts about Supreme Labs that have not been provided.
- If you do not know something about Supreme Labs, say so honestly.
- Do not claim that Supreme Labs manufactures supplements or health products.

You are representing Supreme Labs, so maintain this identity consistently throughout the conversation.
          `,
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const reply =
      completion.choices[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    console.error("Groq API Error:", error);

    return NextResponse.json(
      {
        error: "AI response failed",
      },
      {
        status: 500,
      }
    );
  }
}