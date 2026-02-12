import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { streamMessage } from "@/lib/gemini"; 
import { supabase } from "@/lib/supabase";

// WE REMOVED THE EDGE RUNTIME. 
// This now uses standard Node.js which is much more stable for Google API calls.

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      recipientName, 
      senderName, 
      relationship, 
      occasion, 
      traits, 
      hobbies, 
      tone, 
      photoUrl 
    } = body;

    if (!recipientName || !senderName || !occasion) {
      return NextResponse.json({ error: "Dearly | Missing fields" }, { status: 400 });
    }

    const id = nanoid(8);
    
    // Call our stabilized Gemini 1.5-flash helper
    const stream = await streamMessage({
      recipientName,
      senderName,
      relationship: relationship || "someone special",
      occasion: occasion,
      traits: traits || "wonderful",
      hobbies: hobbies || "life",
      tone: tone || "dearly",
    });

    const encoder = new TextEncoder();
    
    const customStream = new ReadableStream({
      async start(controller) {
        let fullMessage = "";
        
        // Send the ID so the frontend can show a "Patiently creating..." message
        controller.enqueue(encoder.encode(JSON.stringify({ id }) + "\n"));

        try {
          for await (const chunk of stream) {
            const chunkText = chunk.text();
            fullMessage += chunkText;
            controller.enqueue(encoder.encode(chunkText));
          }

          // Save to Supabase AFTER the stream is done
          await supabase.from("greetings").insert({
            id: id,
            recipient_name: recipientName,
            sender_name: senderName,
            relationship: relationship || "Special Person",
            occasion: occasion,
            traits: traits || "Kind",
            hobbies: hobbies || "",
            tone: tone || "sincere",
            message: fullMessage, 
            photo_url: photoUrl || null,
            created_at: new Date().toISOString(),
          });
        } catch (streamErr) {
          console.error("Streaming error inside controller:", streamErr);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(customStream, {
      headers: { 
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive"
      },
    });

  } catch (err) {
    console.error("Dearly Generate error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}