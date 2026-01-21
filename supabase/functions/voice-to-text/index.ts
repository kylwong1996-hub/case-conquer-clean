import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// Decode base64 safely in chunks (keeps memory usage reasonable)
function decodeBase64ToUint8Array(base64String: string, chunkSize = 32768) {
  const normalized = base64String.replace(/[\r\n\s]/g, "");
  const safeChunkSize = Math.max(4, Math.floor(chunkSize / 4) * 4);

  const chunks: Uint8Array[] = [];
  let carry = "";

  for (let position = 0; position < normalized.length; position += safeChunkSize) {
    let part = carry + normalized.slice(position, position + safeChunkSize);

    const remainder = part.length % 4;
    if (remainder !== 0) {
      carry = part.slice(part.length - remainder);
      part = part.slice(0, part.length - remainder);
    } else {
      carry = "";
    }

    if (!part) continue;

    const binaryChunk = atob(part);
    const bytes = new Uint8Array(binaryChunk.length);
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    chunks.push(bytes);
  }

  if (carry) {
    const padded = carry + "=".repeat((4 - (carry.length % 4)) % 4);
    const binaryChunk = atob(padded);
    const bytes = new Uint8Array(binaryChunk.length);
    for (let i = 0; i < binaryChunk.length; i++) {
      bytes[i] = binaryChunk.charCodeAt(i);
    }
    chunks.push(bytes);
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const chunk of chunks) {
    result.set(chunk, offset);
    offset += chunk.length;
  }

  return result;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const audio = body?.audio;
    const mimeType = body?.mimeType;

    if (!audio || typeof audio !== "string") {
      console.error("No audio data provided");
      throw new Error("No audio data provided");
    }

    console.log("Received audio data, length:", audio.length);

    const binaryAudio = decodeBase64ToUint8Array(audio);
    console.log("Decoded binary audio, size:", binaryAudio.length);

    const openAIApiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAIApiKey) {
      console.error("OPENAI_API_KEY not configured");
      throw new Error("OPENAI_API_KEY not configured");
    }

    const safeMimeType =
      typeof mimeType === "string" && mimeType.startsWith("audio/")
        ? mimeType
        : "audio/webm";

    const extension = safeMimeType.includes("mp4")
      ? "mp4"
      : safeMimeType.includes("ogg")
      ? "ogg"
      : safeMimeType.includes("wav")
      ? "wav"
      : safeMimeType.includes("mpeg")
      ? "mp3"
      : "webm";

    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: safeMimeType });
    formData.append("file", blob, `audio.${extension}`);
    formData.append("model", "whisper-1");
    formData.append("language", "en");
    formData.append("temperature", "0");
    formData.append(
      "prompt",
      "Transcribe the audio accurately. Do not add or invent words. If speech is unclear or absent, return an empty transcript."
    );

    console.log("Sending request to OpenAI Whisper API...");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 55_000);

    let response: Response;
    try {
      response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${openAIApiKey}`,
          },
          body: formData,
          signal: controller.signal,
        }
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error("OpenAI API error:", errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const result = await response.json();
    console.log(
      "Transcription successful:",
      result.text?.toString?.().substring?.(0, 100)
    );

    return new Response(JSON.stringify({ text: result.text ?? "" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const isAbort = (error as { name?: string } | null)?.name === "AbortError";
    const errorMessage = isAbort
      ? "Transcription timed out. Please try a shorter recording."
      : error instanceof Error
      ? error.message
      : "Unknown error";

    console.error("Error in voice-to-text function:", errorMessage);

    return new Response(JSON.stringify({ error: errorMessage }), {
      status: isAbort ? 504 : 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
