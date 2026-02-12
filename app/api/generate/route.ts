import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { streamMessage } from "@/lib/gemini"; 
import { supabase } from "../../../lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipientName, senderName, relationship, occasion, traits, hobbies, tone, photoUrl } = body;

    // Safety check for required fields
    if (!recipientName || !senderName || !traits) {
      return NextResponse.json({ error: "Dearly | Missing required fields" }, { status: 400 });
    }

    const id = nanoid(8);
    const stream = await streamMessage({
      recipientName,
      senderName,
      relationship: relationship || "someone special",
      occasion: occasion || "a special moment",
      traits,
      hobbies: hobbies || "their unique passions",
      tone: tone || "dearly",
    });

    const encoder = new TextEncoder();
    const customStream = new ReadableStream({
      async start(controller) {
        let fullMessage = "";
        
        // 1. Send ID first so frontend knows the URL
        controller.enqueue(encoder.encode(JSON.stringify({ id }) + "\n"));

        // 2. Stream the AI text chunks
        for await (const chunk of stream) {
          const chunkText = chunk.text();
          fullMessage += chunkText;
          controller.enqueue(encoder.encode(chunkText));
        }

        // 3. Save to Supabase using the exact column names from your screenshot
        const { error } = await supabase.from("greetings").insert({
          id: id,
          recipient_name: recipientName,
          sender_name: senderName,
          relationship: relationship || "Special Person",
          occasion: occasion || "Celebration", // Ensure this isn't empty!
          traits: traits,
          hobbies: hobbies || "None",
          tone: tone || "dearly",
          message: fullMessage, // This is the generated AI text
          photo_url: photoUrl || null,
          created_at: new Date().toISOString(),
        });

        if (error) {
          console.error("Dearly Database Error:", error.message);
        }

        controller.close();
      },
    });

    return new Response(customStream, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });

  } catch (err) {
    console.error("Dearly Generate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
