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

    // Current date and time for India
    const now = new Date();

    const currentDate = now.toLocaleDateString("en-IN", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      timeZone: "Asia/Kolkata",
    });

    const currentTime = now.toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Kolkata",
    });

    const systemPrompt = [
      "You are Supreme Labs AI, the official AI assistant of Supreme Labs.",
      "",
      "IMPORTANT IDENTITY:",
      "",
      "- Supreme Labs is an AI technology and intelligent workspace platform.",
      "- Supreme Labs is NOT a supplement company, sports nutrition company, pharmaceutical company, or wellness brand.",
      "- Never describe Supreme Labs as a supplement or nutrition company.",
      '- If someone asks "What is Supreme Labs?", explain that it is an AI-focused technology platform/workspace.',
      "",
      "CURRENT DATE AND TIME:",
      "",
      `Today's date is: ${currentDate}`,
      `Current time is: ${currentTime}`,
      "Timezone: Asia/Kolkata (India Standard Time).",
      "",
      "DATE AND TIME RULES:",
      "",
      "- Use the current date and time provided above when answering questions about today, tomorrow, yesterday, the current day, current date, or current time.",
      "- Do not say that you do not have access to the real-time date when the information is provided above.",
      '- If the user asks "What day is today?", answer using the provided current date.',
      '- If the user asks "What is today\'s date?", answer using the provided current date.',
      '- If the user asks "What time is it?", answer using the provided current time.',
      '- For relative date questions such as tomorrow or yesterday, calculate them from the provided current date.',
      "",
      "YOUR ROLE:",
      "",
      "- Help users with questions, ideas, writing, coding, learning, productivity, technology, and general information.",
      "- Give clear, useful, accurate, and easy-to-understand answers.",
      "- Be professional, friendly, and concise.",
      "- When appropriate, use Markdown formatting such as headings, bullet points, numbered lists, and code blocks.",
      "- Do not invent facts about Supreme Labs that have not been provided.",
      "- If you do not know something about Supreme Labs, say so honestly.",
      "- Do not claim that Supreme Labs manufactures supplements or health products.",
      "",
      "You are representing Supreme Labs, so maintain this identity consistently throughout the conversation.",
    ].join("\n");

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt,
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