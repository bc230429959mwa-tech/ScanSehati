import { NextResponse } from "next/server";

// Free MyMemory Translation API
export async function POST(req: Request) {
  try {
    const { text, to } = await req.json();

    const res = await fetch(
      `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
        text
      )}&langpair=en|${to}`
    );
    const data = await res.json();

    const translatedText =
      data?.responseData?.translatedText || "Translation error";

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Translation error:", error);
    return NextResponse.json(
      { error: "Failed to translate" },
      { status: 500 }
    );
  }
}
