import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message, vibe } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    // STEP 1: ASK GOOGLE WHAT MODELS YOU HAVE
    const listUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
    const listRes = await fetch(listUrl);
    const listData = await listRes.json();

    // Find the first model that supports "generateContent"
    const availableModel = listData.models?.find((m: any) => 
      m.supportedGenerationMethods.includes("generateContent")
    );

    if (!availableModel) {
      return NextResponse.json({ error: "No models found for this key" }, { status: 500 });
    }

    console.log("SUCCESS! Using discovered model:", availableModel.name);

    // STEP 2: USE THE DISCOVERED MODEL NAME
    const prompt = `
      Act as a "Passive-Aggressive Playlist Architect". 
      Create a playlist where the FIRST LETTER of each song title spells: "${message}".
      The musical vibe must be: "${vibe}".
      Return ONLY a raw JSON object. No markdown.
      Format: {"playlist": [{"letter": "S", "song": "Song Name", "artist": "Artist"}], "description": "text"}
    `;

    const genUrl = `https://generativelanguage.googleapis.com/v1beta/${availableModel.name}:generateContent?key=${apiKey}`;

    const response = await fetch(genUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const result = await response.json();
    const aiText = result.candidates[0].content.parts[0].text;
    
    const jsonStart = aiText.indexOf('{');
    const jsonEnd = aiText.lastIndexOf('}') + 1;
    const jsonString = aiText.substring(jsonStart, jsonEnd);

    return NextResponse.json(JSON.parse(jsonString));
  } catch (error) {
    console.error("Total Failure:", error);
    return NextResponse.json({ playlist: [], description: "Still searching for a signal..." }, { status: 500 });
  }
}