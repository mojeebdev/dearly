import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { streamMessage } from "@/lib/gemini"; 
import { supabase } from "../../../lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recipientName, senderName, relationship, occasion, traits, hobbies, tone, photoUrl } = body;

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
        
        
        controller.enqueue(encoder.encode(JSON.stringify({ id }) + "\n"));

        for await (const chunk of stream) {
          const chunkText = chunk.text();
          fullMessage += chunkText;
          controller.enqueue(encoder.encode(chunkText));
        }

        
        supabase.from("greetings").insert({
          id,
          recipient_name: recipientName,
          sender_name: senderName,
          relationship,
          occasion,
          traits,
          hobbies,
          tone,
          message: fullMessage,
          photo_url: photoUrl || null,
          created_at: new Date().toISOString(),
        }).then(({ error }) => {
          if (error) console.error("Dearly Background Error:", error);
        });

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