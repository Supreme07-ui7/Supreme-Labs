import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are Supreme Labs AI assistant. Give helpful and clear answers.",
        },
        {
          role: "user",
          content: message,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    return NextResponse.json({
      reply: completion.choices[0]?.message?.content,
    });
  } catch (error) {
    console.error(error);

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