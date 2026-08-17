import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const {
      prompt,
      style = "Realistic",
      aspectRatio = "1:1",
    } = await req.json();

    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json(
        {
          error: "Image prompt is required.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.POLLINATIONS_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "POLLINATIONS_API_KEY is not configured.",
        },
        { status: 500 }
      );
    }

    const aspectRatios: Record<
      string,
      { width: number; height: number }
    > = {
      "1:1": {
        width: 1024,
        height: 1024,
      },
      "16:9": {
        width: 1280,
        height: 720,
      },
      "9:16": {
        width: 720,
        height: 1280,
      },
    };

    const dimensions =
      aspectRatios[aspectRatio] || aspectRatios["1:1"];

    const stylePrompts: Record<string, string> = {
      Realistic:
        "photorealistic, realistic details, natural lighting",
      Cinematic:
        "cinematic photography, dramatic lighting, film still, atmospheric",
      Anime:
        "high-quality anime art, detailed anime style, vibrant illustration",
      "3D":
        "premium 3D render, realistic materials, detailed 3D graphics",
      Illustration:
        "beautiful digital illustration, artistic composition, detailed artwork",
    };

    const selectedStyle =
      stylePrompts[style] || stylePrompts.Realistic;

    const finalPrompt =
      `${prompt.trim()}, ${selectedStyle}`;

    const encodedPrompt = encodeURIComponent(finalPrompt);

    const imageUrl =
      `https://gen.pollinations.ai/image/${encodedPrompt}` +
      `?model=flux&width=${dimensions.width}&height=${dimensions.height}`;

    const response = await fetch(imageUrl, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const errorText = await response.text();

      console.error("Pollinations API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
      });

      return NextResponse.json(
        {
          error: "Pollinations image generation failed.",
          status: response.status,
          details: errorText,
        },
        { status: response.status }
      );
    }

    const imageBuffer = await response.arrayBuffer();

    return new Response(imageBuffer, {
      status: 200,
      headers: {
        "Content-Type":
          response.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Pollinations Image Error:", error);

    return NextResponse.json(
      {
        error: "Something went wrong while generating the image.",
      },
      { status: 500 }
    );
  }
}