import { apiKey } from "@/utils/constants";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import pdfParse from "pdf-parse";

const openai = new OpenAI({
  apiKey, // Ensure this is set in .env.local
});

export async function POST(req) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");
    console.log("File received:", file);

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const pdfData = await pdfParse(buffer);
    const extractedText = pdfData.text.trim();

    if (!extractedText) {
      return NextResponse.json(
        { error: "Empty document, no text found!" },
        { status: 400 }
      );
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: [{ role: "user", content: `Summarize this: ${extractedText}` }],
    });

    return NextResponse.json({ summary: response.choices[0].message.content });
  } catch (error) {
    console.error("Error:", error);
    if (error.response) {
      // If error is from OpenAI or network
      console.error("Error response:", error.response.data);
    }
    return NextResponse.json(
      { error: "Internal Server Error", message: error.message },
      { status: 500 }
    );
  }
}
