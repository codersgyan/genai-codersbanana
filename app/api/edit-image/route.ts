import { NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

function getMimeType(dataUrl: string): string {
  const match = dataUrl.match(
    /^data:(image\/[a-zA-Z+]+);base64,/,
  );

  return match ? match[1] : "image/png";
}

function cleanBase64Image(dataUrl: string): string {
  return dataUrl.replace(/^data:(.*);base64,/, "");
}

export async function POST(request: Request) {
  const { imageBase64, prompt } = await request.json();

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
  });

  const parts = [
    { text: prompt },
    {
      inlineData: {
        mimeType: getMimeType(imageBase64),
        data: cleanBase64Image(imageBase64),
      },
    },
  ];

  const response = await ai.models.generateContent({
    model: "gemini-3-pro-image-preview",
    contents: parts,
  });

  const content = response.candidates?.[0]?.content;

  if (content?.parts) {
    for (const part of content?.parts) {
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;

        return NextResponse.json({
          result: `data:image/png;base64,${imageData}`,
        });
      }
    }
  }

  return NextResponse.json({
    message: "Failed to generate the image",
  });
}
