export async function translateText(text: string, to: string) {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, to }),
    });

    if (!res.ok) throw new Error("Translation API failed");

    const data = await res.json();
    return data.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    return text;
  }
}
