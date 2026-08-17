"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AIImagePage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("Realistic");
const [aspectRatio, setAspectRatio] = useState("1:1");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  type GalleryImage = {
  id: string;
  user_id: string;
  image_url: string;
  prompt: string;
  style: string;
  aspect_ratio: string;
  created_at: string;
};

const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
const [galleryLoading, setGalleryLoading] = useState(false);

  // Clean up generated object URL
  useEffect(() => {
    return () => {
      if (imageUrl) {
        URL.revokeObjectURL(imageUrl);
      }
    };
  }, [imageUrl]);
// Gallery states



// Gallery function
const loadGallery = async () => {
  // ...
};

const generateImage = async () => {
  const trimmedPrompt = prompt.trim();

  if (!trimmedPrompt || loading) {
    return;
  }

  setLoading(true);
  setError("");

  // Remove previous image before generating a new one
  if (imageUrl) {
    URL.revokeObjectURL(imageUrl);
    setImageUrl(null);
  }

  try {
    const response = await fetch("/api/generate-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: trimmedPrompt,
        style,
        aspectRatio,
      }),
    });

    if (!response.ok) {
      let errorMessage = "Image generation failed.";

      try {
        const data = await response.json();

        if (data?.error) {
          errorMessage = data.error;
        }
      } catch {
        // Keep default error message
      }

      throw new Error(errorMessage);
    }

    // Continue with successful response
    const blob = await response.blob();

    if (!blob || blob.size === 0) {
      throw new Error("Generated image is empty.");
    }

    const generatedImageUrl = URL.createObjectURL(blob);

setImageUrl(generatedImageUrl);

// Save generated image to Supabase Gallery
try {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "Please sign in to save images to your gallery."
    );
  }

  const fileName = `${crypto.randomUUID()}.jpg`;
  const filePath = `${user.id}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("generated-images")
    .upload(filePath, blob, {
      contentType: blob.type || "image/jpeg",
      upsert: false,
    });

  if (uploadError) {
    throw uploadError;
  }

  const { error: databaseError } = await supabase
    .from("generated_images")
    .insert({
      user_id: user.id,
      image_url: filePath,
      prompt: trimmedPrompt,
      style,
      aspect_ratio: aspectRatio,
    });

  if (databaseError) {
    throw databaseError;
  }
} catch (saveError) {
  console.error("Gallery save error:", saveError);

  setError(
    "Image generated successfully, but it could not be saved to your gallery."
  );
}
  } catch (error) {
    console.error("Image generation error:", error);

    setError(
      error instanceof Error
        ? error.message
        : "Image generation failed. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  const downloadImage = () => {
    if (!imageUrl) {
      return;
    }

    const link = document.createElement("a");

    link.href = imageUrl;
    link.download = "supreme-labs-ai-image.jpg";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const clearImage = () => {
    if (imageUrl) {
      URL.revokeObjectURL(imageUrl);
    }

    setImageUrl(null);
    setError("");
  };

  return (
    <main className="min-h-screen bg-[#09090B] text-white">
      {/* ========================================
          HEADER
      ======================================== */}

      <header className="h-16 border-b border-white/10 flex items-center px-5 md:px-8">
        <div className="flex-1">
          <h1 className="font-semibold text-lg">
            🖼️ AI Image Generator
          </h1>

          <p className="text-xs text-white/35 mt-0.5">
            Supreme Labs Intelligent Workspace
          </p>
        </div>

        <a
          href="/ai-chat"
          className="
            rounded-xl
            border
            border-white/10
            bg-white/5
            hover:bg-white/10
            px-4
            py-2
            text-sm
            transition
          "
        >
          ← AI Chat
        </a>
      </header>

      {/* ========================================
          MAIN CONTENT
      ======================================== */}

      <div className="w-full max-w-5xl mx-auto px-4 md:px-8 py-10">
        {/* Hero */}

        <div className="text-center max-w-2xl mx-auto mb-10">
          <div
            className="
              inline-flex
              items-center
              justify-center
              w-14
              h-14
              rounded-2xl
              bg-white/10
              border
              border-white/10
              text-2xl
              mb-5
            "
          >
            ✨
          </div>

          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
            Create Images with AI
          </h2>

          <p className="text-white/45 mt-3 text-sm md:text-base leading-6">
            Describe the image you want and Supreme Labs AI will generate it
            for you.
          </p>
        </div>

        {/* ========================================
            PROMPT CARD
        ======================================== */}

        <section
          className="
            max-w-3xl
            mx-auto
            rounded-2xl
            border
            border-white/10
            bg-white/[0.035]
            p-4
            md:p-5
            shadow-2xl
            shadow-black/20
          "
        >
          <label
            htmlFor="image-prompt"
            className="block text-sm font-medium text-white/80 mb-3"
          >
            Describe your image
          </label>

          <textarea
            id="image-prompt"
            value={prompt}
            onChange={(event) => {
              setPrompt(event.target.value);
              setError("");
            }}
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();

                if (prompt.trim() && !loading) {
                  generateImage();
                }
              }
            }}
            placeholder="Example: A futuristic city at sunset, cinematic lighting, ultra detailed..."
            rows={4}
            disabled={loading}
            className="
              w-full
              resize-none
              rounded-xl
              border
              border-white/10
              bg-black/30
              px-4
              py-3
              text-sm
              md:text-[15px]
              leading-6
              text-white
              placeholder:text-white/25
              outline-none
              transition
              focus:border-white/20
              disabled:opacity-50
            "
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">

  {/* Style */}
  <div>
    <label className="block text-xs text-white/40 mb-2">
      Style
    </label>

    <select
      value={style}
      onChange={(event) => setStyle(event.target.value)}
      disabled={loading}
      className="
        w-full
        rounded-xl
        border
        border-white/10
        bg-black/30
        px-4
        py-3
        text-sm
        text-white
        outline-none
        focus:border-white/20
        disabled:opacity-50
      "
    >
      <option value="Realistic">Realistic</option>
      <option value="Cinematic">Cinematic</option>
      <option value="Anime">Anime</option>
      <option value="3D">3D</option>
      <option value="Illustration">Illustration</option>
    </select>
  </div>

  {/* Aspect Ratio */}
  <div>
    <label className="block text-xs text-white/40 mb-2">
      Aspect Ratio
    </label>

    <select
      value={aspectRatio}
      onChange={(event) => setAspectRatio(event.target.value)}
      disabled={loading}
      className="
        w-full
        rounded-xl
        border
        border-white/10
        bg-black/30
        px-4
        py-3
        text-sm
        text-white
        outline-none
        focus:border-white/20
        disabled:opacity-50
      "
    >
      <option value="1:1">1:1 Square</option>
      <option value="16:9">16:9 Landscape</option>
      <option value="9:16">9:16 Portrait</option>
    </select>
  </div>

</div>

          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
            <button
              type="button"
              onClick={generateImage}
              disabled={!prompt.trim() || loading}
              className="
                flex-1
                rounded-xl
                bg-white
                text-black
                font-medium
                py-3
                px-5
                transition
                hover:scale-[1.01]
                active:scale-[0.99]
                disabled:opacity-30
                disabled:cursor-not-allowed
                disabled:hover:scale-100
              "
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span
                    className="
                      w-4
                      h-4
                      rounded-full
                      border-2
                      border-black/20
                      border-t-black
                      animate-spin
                    "
                  />

                             Generating Image...
                </span>
              ) : (
                "✨ Generate Image"
              )}
            </button>

            {imageUrl && !loading && (
              <button
                type="button"
                onClick={clearImage}
                className="
                  rounded-xl
                  border
                  border-white/10
                  bg-white/5
                  hover:bg-white/10
                  px-5
                  py-3
                  text-sm
                  transition
                "
              >
                New Image
              </button>
            )}
          </div>

          <p className="text-[11px] text-white/25 text-center mt-3">
            Press Enter to generate · Shift + Enter for a new line
          </p>
        </section>

        {/* ========================================
            ERROR
        ======================================== */}

        {error && (
          <div className="max-w-3xl mx-auto mt-5">
            <div
              className="
                rounded-xl
                border
                border-red-400/20
                bg-red-500/5
                px-4
                py-3
                text-sm
                text-red-300
              "
            >
              ⚠️ {error}
            </div>
          </div>
        )}

        {/* ========================================
            LOADING AREA
        ======================================== */}

        {loading && (
          <section className="max-w-3xl mx-auto mt-8">
            <div
              className="
                aspect-square
                max-w-2xl
                mx-auto
                rounded-2xl
                border
                border-white/10
                bg-white/[0.025]
                flex
                flex-col
                items-center
                justify-center
                text-center
              "
            >
              <div
                className="
                  w-12
                  h-12
                  rounded-full
                  border-4
                  border-white/10
                  border-t-white
                  animate-spin
                  mb-5
                "
              />

              <p className="text-sm text-white/70">
                Creating your image...
              </p>

              <p className="text-xs text-white/30 mt-2">
                This may take a little while.
              </p>
            </div>
          </section>
        )}

        {/* ========================================
            GENERATED IMAGE
        ======================================== */}

        {imageUrl && !loading && (
          <section className="max-w-3xl mx-auto mt-8">

            <div className="
              flex
              flex-col
              sm:flex-row
              sm:items-center
              sm:justify-between
              gap-3
              mb-3
            ">
              <div>
                <h3 className="font-semibold">
                  Generated Image
                </h3>

                <p className="text-xs text-white/30 mt-1">
                  Created by Supreme Labs AI
                </p>
              </div>

              {/* ========================================
                  IMAGE ACTIONS
              ======================================== */}

              <div className="flex items-center gap-2">

                {/* Regenerate */}
                <button
                  type="button"
                onClick={generateImage}
                  disabled={loading}
                  className="
                    rounded-xl
                    border
                    border-white/10
                    bg-white/5
                    hover:bg-white/10
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition
                    disabled:opacity-40
                    disabled:cursor-not-allowed
                  "
                >
                  🔄 Regenerate
                </button>

                {/* Download */}
                <button
                  type="button"
                  onClick={downloadImage}
                  className="
                    rounded-xl
                    bg-white
                    text-black
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition
                    hover:scale-[1.02]
                    active:scale-[0.98]
                  "
                >
                  ↓ Download
                </button>

              </div>
            </div>

            {/* ========================================
                IMAGE PREVIEW
            ======================================== */}

            <div
              className="
                overflow-hidden
                rounded-2xl
                border
                border-white/10
                bg-black
                shadow-2xl
                shadow-black/30
              "
            >
              <img
                src={imageUrl}
                alt={prompt || "AI generated image"}
                className="
                  block
                  w-full
                  h-auto
                  object-contain
                "
              />
            </div>

            {/* ========================================
                IMAGE DETAILS
            ======================================== */}

            <div className="
              mt-4
              rounded-xl
              bg-white/[0.03]
              border
              border-white/5
              px-4
              py-3
            ">

              <p className="
                text-[11px]
                uppercase
                tracking-wider
                text-white/25
                mb-1
              ">
                Prompt
              </p>

              <p className="
                text-sm
                text-white/60
                leading-6
                break-words
              ">
                {prompt}
              </p>

              <div className="
                flex
                flex-wrap
                gap-2
                mt-3
              ">

                <span className="
                  rounded-lg
                  bg-white/5
                  border
                  border-white/5
                  px-3
                  py-1.5
                  text-[11px]
                  text-white/40
                ">
                  🎨 {style}
                </span>

                <span className="
                  rounded-lg
                  bg-white/5
                  border
                  border-white/5
                  px-3
                  py-1.5
                  text-[11px]
                  text-white/40
                ">
                  📐 {aspectRatio}
                </span>

              </div>
            </div>

          </section>
        )}

        {/* ========================================
            EMPTY STATE
        ======================================== */}

        {!imageUrl && !loading && !error && (
          <section className="max-w-3xl mx-auto mt-8">
            <div
              className="
                rounded-2xl
                border
                border-dashed
                border-white/10
                bg-white/[0.02]
                px-6
                py-14
                text-center
              "
            >
              <div className="text-4xl mb-4">
                🖼️
              </div>

              <h3 className="font-medium text-white/70">
                Your generated image will appear here
              </h3>

              <p className="text-sm text-white/30 mt-2">
                Enter a detailed prompt above to get started.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
